package com.example.url_shortener.utils;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class IdGeneratorTest {

    private static final String BASE62_PATTERN = "^[0-9A-Za-z]+$";

    @Test
    void generateId_returnsSixCharacterString() {
        String id = IdGenerator.generateId("https://www.example.com");
        assertThat(id).hasSize(6);
    }

    @Test
    void generateId_isDeterministic() {
        String url = "https://www.example.com";
        assertThat(IdGenerator.generateId(url)).isEqualTo(IdGenerator.generateId(url));
    }

    @Test
    void generateId_differentInputsProduceDifferentIds() {
        String id1 = IdGenerator.generateId("https://www.example.com");
        String id2 = IdGenerator.generateId("https://www.other.com");
        assertThat(id1).isNotEqualTo(id2);
    }

    @Test
    void generateId_outputContainsOnlyBase62Characters() {
        String id = IdGenerator.generateId("https://www.example.com");
        assertThat(id).matches(BASE62_PATTERN);
    }

    @Test
    void generateId_saltChangesOutput() {
        String url = "https://www.example.com";
        String id1 = IdGenerator.generateId(url);
        String id2 = IdGenerator.generateId(url + "1");
        assertThat(id1).isNotEqualTo(id2);
    }
}
