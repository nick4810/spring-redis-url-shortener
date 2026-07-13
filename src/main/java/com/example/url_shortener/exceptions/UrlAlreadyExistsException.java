package com.example.url_shortener.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UrlAlreadyExistsException extends RuntimeException {
    public UrlAlreadyExistsException(String url) {
        super("URL already shortened: " + url);
    }
}
