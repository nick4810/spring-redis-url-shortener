package com.example.url_shortener.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import com.example.url_shortener.domain.ShortenRequest;
import com.example.url_shortener.domain.Url;
import com.example.url_shortener.exceptions.UrlNotFoundException;
import com.example.url_shortener.repository.UrlRepository;
import com.example.url_shortener.utils.IdGenerator;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UrlShortenerController {
    @Autowired
    private UrlRepository urlRepository;

    private long ttlSeconds = 60 * 60 * 24 * 7; // 1 week

    @PostMapping("/shorten")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> shortenUrl(@RequestBody ShortenRequest request) {
        String originalUrl = request.originalUrl();
        String candidate = IdGenerator.generateId(originalUrl);
        final String shortCode = urlRepository.existsById(candidate)
                ? IdGenerator.generateId(originalUrl + "1")
                : candidate;

        return urlRepository.findByOriginalUrl(originalUrl)
                .map(url -> Map.of("id", url.getId()))
                .orElseGet(() -> {
                    urlRepository.save(Url.builder()
                            .id(shortCode)
                            .originalUrl(originalUrl)
                            .createdAt(java.time.Instant.now())
                            .ttlSeconds(ttlSeconds)
                            .clickCount(0)
                            .build());
                    return Map.of("id", shortCode);
                });
    }

    @GetMapping("/{id}")
    public Map<String, String> get(@PathVariable("id") String id) {
        return urlRepository.findById(id)
                .map(url -> Map.of("originalUrl", url.getOriginalUrl()))
                .orElseThrow(() -> new UrlNotFoundException(id));
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable("id") String id) {
        if (!urlRepository.existsById(id)) {
            throw new UrlNotFoundException(id);
        }
        urlRepository.deleteById(id);
        return Map.of("message", "URL deleted successfully");
    }

    @GetMapping("/stats/{id}")
    public Map<String, Object> getStats(@PathVariable("id") String id) {
        return urlRepository.findById(id)
                .map(url -> Map.<String, Object>of(
                        "id", url.getId(),
                        "originalUrl", url.getOriginalUrl(),
                        "clickCount", url.getClickCount(),
                        "createdAt", url.getCreatedAt()
                ))
                .orElseThrow(() -> new UrlNotFoundException(id));
    }
}
