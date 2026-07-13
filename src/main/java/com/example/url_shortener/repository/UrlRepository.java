package com.example.url_shortener.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.example.url_shortener.domain.Url;
import com.redis.om.spring.repository.RedisDocumentRepository;

@Repository
public interface UrlRepository extends RedisDocumentRepository<Url, String> {
    Optional<Url> findByOriginalUrl(String originalUrl);
}
