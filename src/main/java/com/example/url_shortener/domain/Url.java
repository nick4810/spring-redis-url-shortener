package com.example.url_shortener.domain;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.TimeToLive;

import com.redis.om.spring.annotations.Document;
import com.redis.om.spring.annotations.Indexed;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document
@Getter 
@Setter 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor
public class Url {
    @Id
    private String id;

    @Indexed // enables findByOriginalUrl for dedup
    private String originalUrl;

    private Instant createdAt;

    @TimeToLive
    private Long ttlSeconds;

    private long clickCount;
}
