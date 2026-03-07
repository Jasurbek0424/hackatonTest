package com.finapp.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final WebClient webClient;
    private final String apiKey;

    public AIService(@Value("${anthropic.api-key:}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
                .baseUrl("https://api.anthropic.com/v1")
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String categorize(String description) {
        if (apiKey == null || apiKey.isBlank()) {
            return guessCategory(description);
        }

        try {
            String prompt = "You are a financial categorizer. Given this expense description, respond with ONLY one category from: " +
                    "Food, Transport, Shopping, Health, Entertainment, Bills, Education, Other. " +
                    "Description: \"" + description + "\". Category:";

            Map<String, Object> body = Map.of(
                    "model", "claude-haiku-4-5-20251001",
                    "max_tokens", 50,
                    "messages", List.of(Map.of("role", "user", "content", prompt))
            );

            Map response = webClient.post()
                    .uri("/messages")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("content")) {
                List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
                if (!content.isEmpty()) {
                    return ((String) content.get(0).get("text")).trim();
                }
            }
        } catch (Exception e) {
            System.err.println("AI categorize error: " + e.getMessage());
        }
        return guessCategory(description);
    }

    public String getAdvice(String transactionSummary) {
        if (apiKey == null || apiKey.isBlank()) {
            return "AI advice is not available. Please set ANTHROPIC_API_KEY environment variable.";
        }

        try {
            String prompt = "You are a personal finance advisor. Analyze these transactions and give brief, " +
                    "practical financial advice in 3-5 bullet points. Be specific and actionable.\n\n" +
                    transactionSummary;

            Map<String, Object> body = Map.of(
                    "model", "claude-haiku-4-5-20251001",
                    "max_tokens", 500,
                    "messages", List.of(Map.of("role", "user", "content", prompt))
            );

            Map response = webClient.post()
                    .uri("/messages")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("content")) {
                List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
                if (!content.isEmpty()) {
                    return ((String) content.get(0).get("text")).trim();
                }
            }
        } catch (Exception e) {
            System.err.println("AI advice error: " + e.getMessage());
        }
        return "Unable to generate advice at this time.";
    }

    private String guessCategory(String description) {
        String lower = description.toLowerCase();
        if (lower.contains("food") || lower.contains("lunch") || lower.contains("dinner") ||
            lower.contains("breakfast") || lower.contains("restaurant") || lower.contains("cafe") ||
            lower.contains("ovqat") || lower.contains("tushlik") || lower.contains("nonushta")) {
            return "Food";
        } else if (lower.contains("taxi") || lower.contains("uber") || lower.contains("bus") ||
                   lower.contains("metro") || lower.contains("fuel") || lower.contains("benzin") ||
                   lower.contains("transport")) {
            return "Transport";
        } else if (lower.contains("shop") || lower.contains("buy") || lower.contains("store") ||
                   lower.contains("market") || lower.contains("kiyim") || lower.contains("sotib")) {
            return "Shopping";
        } else if (lower.contains("doctor") || lower.contains("pharmacy") || lower.contains("hospital") ||
                   lower.contains("dorixona") || lower.contains("shifoxona")) {
            return "Health";
        } else if (lower.contains("movie") || lower.contains("cinema") || lower.contains("game") ||
                   lower.contains("kino") || lower.contains("concert")) {
            return "Entertainment";
        } else if (lower.contains("rent") || lower.contains("electric") || lower.contains("internet") ||
                   lower.contains("phone") || lower.contains("ijara") || lower.contains("kommunal")) {
            return "Bills";
        } else if (lower.contains("course") || lower.contains("book") || lower.contains("study") ||
                   lower.contains("kurs") || lower.contains("kitob") || lower.contains("talim")) {
            return "Education";
        }
        return "Other";
    }
}
