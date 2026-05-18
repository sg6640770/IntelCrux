package com.youtube_video.summary.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.youtube_video.summary.dao.UserDao;
import com.youtube_video.summary.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserDao userDao;

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void register(String email, String password) throws SQLException {
        if (userDao.findByEmail(email) != null) {
            throw new RuntimeException("Email is already registered.");
        }

        String token = UUID.randomUUID().toString();
        String hashedPassword = passwordEncoder.encode(password);

        User user = new User();
        user.setEmail(email);
        user.setPassword(hashedPassword);
        user.setVerified(false);
        user.setVerificationToken(token);

        userDao.save(user);
        sendVerificationEmail(email, token);
    }

    public void verify(String token) throws SQLException {
        User user = userDao.findByVerificationToken(token);
        if (user == null) {
            throw new RuntimeException("Invalid or expired verification token.");
        }
        userDao.verifyUser(token);
    }

    public String login(String email, String rawPassword) throws SQLException {
        User user = userDao.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Email not registered.");
        }

        if (!user.isVerified()) {
            throw new RuntimeException("Email not verified. Please verify before logging in.");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid credentials.");
        }

        return jwtService.generateToken(user.getEmail());
    }

    private void sendVerificationEmail(String to, String token) {
        String verificationLink = "https://intelcrux-production.up.railway.app/verify?token=" + token;

        Resend resend = new Resend(resendApiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("onboarding@resend.dev")
                .to(List.of(to))
                .subject("Verify your email")
                .html("<p>Click to verify: <a href=\"" + verificationLink + "\">" + verificationLink + "</a></p>")
                .build();

        try {
            resend.emails().send(params);
            System.out.println("✅ Verification email sent to " + to);
        } catch (ResendException e) {
            System.err.println("❌ Failed to send verification email: " + e.getMessage());
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
}
