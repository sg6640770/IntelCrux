package com.youtube_video.summary.dao;

import com.youtube_video.summary.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;

import javax.sql.DataSource;
import java.sql.*;

@Repository
public class UserDao {

    private final DataSource dataSource;
    private Connection connection;

    @Autowired
    public UserDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void init() throws SQLException {
        this.connection = dataSource.getConnection();
        System.out.println("✅ Connected to the database via DataSource.");
    }

    public void save(User user) throws SQLException {
        String sql = "INSERT INTO users (email, password, verification_token, verified) VALUES (?, ?, ?, false)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            System.out.println("📝 Inserting user...");
            System.out.println("📧 Email: " + user.getEmail());
            System.out.println("🔑 Password (hashed): " + user.getPassword());
            System.out.println("🔐 Verification Token: " + user.getVerificationToken());

            ps.setString(1, user.getEmail());
            ps.setString(2, user.getPassword());
            ps.setString(3, user.getVerificationToken());
            ps.executeUpdate();

            System.out.println("✅ User inserted successfully.");
        }
    }

    public User findByVerificationToken(String token) throws SQLException {
        String sql = "SELECT * FROM users WHERE verification_token = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, token);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                System.out.println("🔍 Found user with token: " + token);
                return mapResultSetToUser(rs);
            } else {
                System.out.println("❌ No user found with token: " + token);
            }
        }
        return null;
    }

    public User findByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                System.out.println("🔍 Found user with email: " + email);
                return mapResultSetToUser(rs);
            } else {
                System.out.println("❌ No user found with email: " + email);
            }
        }
        return null;
    }

    public void verifyUser(String token) throws SQLException {
        String sql = "UPDATE users SET verified = true, verification_token = NULL WHERE verification_token = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, token);
            int updated = ps.executeUpdate();
            System.out.println("✅ Verified user with token: " + token + ", Rows affected: " + updated);
        }
    }

    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setVerified(rs.getBoolean("verified"));
        user.setVerificationToken(rs.getString("verification_token"));
        return user;
    }
}
