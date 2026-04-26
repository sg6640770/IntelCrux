package com.youtube_video.summary.service;

import com.youtube_video.summary.model.Summary;
import com.youtube_video.summary.repository.SummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SummaryService {

    @Autowired
    private SummaryRepository repository;

    public void saveSummary(Summary summary) {
        if (summary.getUserEmail() == null || summary.getUserEmail().isEmpty()) {
            throw new IllegalArgumentException("userEmail must not be null or empty");
        }

        repository.save(summary, summary.getUserEmail());
    }

    // FIXED: Use email directly to fetch summaries
    public List<Summary> getSummariesByEmail(String email) {
        return repository.findByUser(email);
    }

    public void createUser(String email) {
        try {
            repository.getOrCreateUserId(email);
        } catch (Exception e) {
            System.err.println("Failed to create user: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create user", e);
        }
    }
}
