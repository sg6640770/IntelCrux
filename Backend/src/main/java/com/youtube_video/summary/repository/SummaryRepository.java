package com.youtube_video.summary.repository;

import com.youtube_video.summary.model.Summary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;

@Repository
public class SummaryRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Fetch user_id using email or create user if not exists
    public int getOrCreateUserId(String email) {
        try {
            List<Integer> ids = jdbcTemplate.query(
                    "SELECT id FROM users WHERE email = ?",
                    (rs, rowNum) -> rs.getInt("id"),
                    email
            );

            if (!ids.isEmpty()) {
                return ids.get(0);
            }


            jdbcTemplate.update("INSERT INTO users (email) VALUES (?)", email);

            return jdbcTemplate.queryForObject(
                    "SELECT id FROM users WHERE email = ?",
                    Integer.class,
                    email
            );
        } catch (Exception e) {
            System.err.println("❌ Error in getOrCreateUserId(): " + e.getMessage());
            e.printStackTrace(); // ✅ prints full stack trace
            throw new RuntimeException("Failed to get or create user ID", e);
        }
    }


    private final RowMapper<Summary> rowMapper = (rs, rowNum) -> {
        Summary s = new Summary();
        s.setId(rs.getInt("id"));
        s.setUserId(rs.getInt("user_id"));
        s.setVideoUrl(rs.getString("video_url"));
        s.setVideoTitle(rs.getString("video_title"));
        s.setSummary(rs.getString("summary"));
        s.setVideoThumbnail(rs.getString("video_thumbnail"));
        s.setCreatedAt(rs.getString("created_at"));
        s.setVideoId(rs.getString("video_id"));
        s.setTranscript(rs.getString("transcript"));

        // Fetch user email manually (optional)
        try {
            int userId = rs.getInt("user_id");
            String email = jdbcTemplate.queryForObject(
                    "SELECT email FROM users WHERE id = ?",
                    String.class,
                    userId
            );
            s.setUserEmail(email);
        } catch (Exception e) {
            // leave email blank if not found
        }

        return s;
    };


    public void save(Summary summary, String userEmail) {
        int userId = getOrCreateUserId(userEmail);
        String createdAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        jdbcTemplate.update("""
INSERT INTO summary
(user_id, video_url, video_title, summary, video_thumbnail, created_at, video_id, transcript)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
summary = VALUES(summary),
transcript = VALUES(transcript),
created_at = VALUES(created_at)
""",
                userId,
                summary.getVideoUrl(),
                summary.getVideoTitle(),
                summary.getSummary(),
                summary.getVideoThumbnail(),
                createdAt,
                summary.getVideoId(),
                summary.getTranscript()
        );

    }


    public List<Summary> findByUser(String email) {
        String sql = """
        SELECT s.*, u.email AS user_email FROM summary s
        JOIN users u ON s.user_id = u.id
        WHERE u.email = ?
        ORDER BY s.created_at DESC
    """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Summary s = new Summary();
            s.setId(rs.getInt("id"));
            s.setUserId(rs.getInt("user_id"));
            s.setVideoUrl(rs.getString("video_url"));
            s.setVideoTitle(rs.getString("video_title"));
            s.setSummary(rs.getString("summary"));
            s.setVideoThumbnail(rs.getString("video_thumbnail"));
            s.setCreatedAt(rs.getString("created_at"));
            s.setUserEmail(rs.getString("user_email"));
            s.setVideoId(rs.getString("video_id"));
            s.setTranscript(rs.getString("transcript"));// ✅ populated correctly now
            return s;
        }, email);
    }


    public List<Summary> findByUserId(int userId) {
        return jdbcTemplate.query(
                "SELECT * FROM summary WHERE user_id = ? ORDER BY created_at DESC",
                rowMapper,
                userId
        );
    }

    public int findUserIdByEmail(String email) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM users WHERE email = ?",
                    Integer.class,
                    email
            );
        } catch (Exception e) {
            return -1;
        }
    }
    public String findTranscriptByVideoId(String videoId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT transcript FROM summary WHERE video_id = ? LIMIT 1",
                    String.class,
                    videoId
            );
        } catch (Exception e) {
            return null;
        }
    }

}
