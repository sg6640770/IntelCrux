package com.youtube_video.summary.service;

import com.youtube_video.summary.dao.UserDao;
import com.youtube_video.summary.model.User;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtService jwtService; // Inject JwtService

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // SIGNUP: Save user and send verification email
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

    // VERIFICATION: Match token and mark user as verified
    public void verify(String token) throws SQLException {
        User user = userDao.findByVerificationToken(token);
        if (user == null) {
            throw new RuntimeException("Invalid or expired verification token.");
        }

        userDao.verifyUser(token); // sets verified = true and clears the token
    }

    // LOGIN: Allow only verified users
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

        // Generate and return JWT token
        return jwtService.generateToken(user.getEmail());
    }

    // EMAIL: Send verification email
    private void sendVerificationEmail(String to, String token) {
        String verificationUrl = "http://localhost:8080/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Verify your email");
        message.setText("Welcome! Please verify your account by clicking the link: " + verificationUrl);

        mailSender.send(message);
    }
}
