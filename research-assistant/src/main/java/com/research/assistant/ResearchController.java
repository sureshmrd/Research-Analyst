package com.research.assistant;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/research")
@CrossOrigin(origins = "*")//allow all domains.
@AllArgsConstructor //lombok annotation which provides all-arg constructor
public class ResearchController
{
    private final ResearchService researchService;

    @PostMapping("/process")
    public ResponseEntity<String> processContent(@RequestBody ResearchRequest request){
        String result = researchService.processContent(request);
        return ResponseEntity.ok(result);
    }
}
