package com.youtube_video.summary.controller;

import com.youtube_video.summary.model.Summary;
import com.youtube_video.summary.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/summaries")
@CrossOrigin(origins = "*")
public class SummaryController {

    @Autowired
    private SummaryService service;

    @PostMapping()
    public String save(@RequestBody Summary summary) {
        // summary object must contain userEmail (sent from frontend)
        System.out.println("Received summary for user: " + summary.getUserEmail());
        service.saveSummary(summary);
        return "Summary saved successfully";
    }

    @GetMapping("/{email}")
    public List<Summary> getSummariesByEmail(@PathVariable String email) {
        return service.getSummariesByEmail(email);
    }


}