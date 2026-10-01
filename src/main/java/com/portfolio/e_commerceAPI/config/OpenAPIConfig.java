package com.portfolio.e_commerceAPI.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {
    @Bean
    public OpenAPI customOpenAPI(){
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce API")
                        .description("API para gerenciamento de produtos, categorias e pedidos")
                        .version("1.0.0"));
    }
}
