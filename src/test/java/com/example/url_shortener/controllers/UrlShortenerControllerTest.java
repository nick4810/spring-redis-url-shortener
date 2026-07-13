package com.example.url_shortener.controllers;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.url_shortener.domain.Url;
import com.example.url_shortener.repository.UrlRepository;
import com.example.url_shortener.utils.IdGenerator;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UrlShortenerControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UrlRepository urlRepository;

    @InjectMocks
    private UrlShortenerController controller;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    private static final String ORIGINAL_URL = "https://www.example.com";
    private static final String SHORT_CODE = IdGenerator.generateId(ORIGINAL_URL);

    // POST /shorten

    @Test
    void shortenUrl_newUrl_returnsCreatedWithShortCode() throws Exception {
        when(urlRepository.existsById(anyString())).thenReturn(false);
        when(urlRepository.findByOriginalUrl(ORIGINAL_URL)).thenReturn(Optional.empty());
        when(urlRepository.save(any(Url.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(post("/shorten")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"originalUrl\": \"" + ORIGINAL_URL + "\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(SHORT_CODE));
    }

    @Test
    void shortenUrl_duplicateUrl_returnsExistingShortCode() throws Exception {
        Url existing = Url.builder()
                .id(SHORT_CODE)
                .originalUrl(ORIGINAL_URL)
                .createdAt(Instant.now())
                .build();

        when(urlRepository.existsById(anyString())).thenReturn(false);
        when(urlRepository.findByOriginalUrl(ORIGINAL_URL)).thenReturn(Optional.of(existing));

        mockMvc.perform(post("/shorten")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"originalUrl\": \"" + ORIGINAL_URL + "\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(SHORT_CODE));
    }

    // GET /{id}

    @Test
    void getUrl_existingId_returnsOriginalUrl() throws Exception {
        Url url = Url.builder()
                .id(SHORT_CODE)
                .originalUrl(ORIGINAL_URL)
                .build();

        when(urlRepository.findById(SHORT_CODE)).thenReturn(Optional.of(url));

        mockMvc.perform(get("/{id}", SHORT_CODE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.originalUrl").value(ORIGINAL_URL));
    }

    @Test
    void getUrl_unknownId_returns404() throws Exception {
        when(urlRepository.findById("unknown")).thenReturn(Optional.empty());

        mockMvc.perform(get("/{id}", "unknown"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("No URL found for id: unknown"));
    }

    // DELETE /{id}

    @Test
    void deleteUrl_existingId_returnsSuccessMessage() throws Exception {
        when(urlRepository.existsById(SHORT_CODE)).thenReturn(true);

        mockMvc.perform(delete("/{id}", SHORT_CODE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("URL deleted successfully"));

        verify(urlRepository).deleteById(SHORT_CODE);
    }

    @Test
    void deleteUrl_unknownId_returns404() throws Exception {
        when(urlRepository.existsById("unknown")).thenReturn(false);

        mockMvc.perform(delete("/{id}", "unknown"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("No URL found for id: unknown"));
    }

    // GET /stats/{id}

    @Test
    void getStats_existingId_returnsStats() throws Exception {
        Instant now = Instant.now();
        Url url = Url.builder()
                .id(SHORT_CODE)
                .originalUrl(ORIGINAL_URL)
                .createdAt(now)
                .clickCount(42)
                .build();

        when(urlRepository.findById(SHORT_CODE)).thenReturn(Optional.of(url));

        mockMvc.perform(get("/stats/{id}", SHORT_CODE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(SHORT_CODE))
                .andExpect(jsonPath("$.originalUrl").value(ORIGINAL_URL))
                .andExpect(jsonPath("$.clickCount").value(42));
    }

    @Test
    void getStats_unknownId_returns404() throws Exception {
        when(urlRepository.findById("unknown")).thenReturn(Optional.empty());

        mockMvc.perform(get("/stats/{id}", "unknown"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("No URL found for id: unknown"));
    }
}
