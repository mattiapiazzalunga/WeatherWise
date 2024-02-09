package com.weatherwise.apigateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // Disabilita CSRF se non necessario
                .authorizeRequests()
                .anyRequest().permitAll() // Permetti tutte le richieste, adatta secondo le tue necessità
                .and()
                .headers()
                .contentSecurityPolicy("default-src 'self'; connect-src 'self' http://localhost:8080;")
                .and()
                .frameOptions().sameOrigin(); // Permetti i frame dalla stessa origine, se necessario
    }
}
