package utility;


import java.util.Base64;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class TokenUtil {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static JsonNode decodePayload(String accessToken) {
        try {
            // JWT = header.payload.signature
            String[] parts = accessToken.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            return mapper.readTree(payload);
        } catch (Exception e) {
            throw new RuntimeException("Invalid access token", e);
        }
    }

    public static String getUserId(String accessToken) {
        return decodePayload(accessToken).get("sub").asText();
    }

    public static String getSessionId(String accessToken) {
        return decodePayload(accessToken).get("sid").asText();
    }
}
