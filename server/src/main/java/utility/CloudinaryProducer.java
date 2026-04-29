package utility;
import java.util.Map;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.cloudinary.Cloudinary;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;

@ApplicationScoped
public class CloudinaryProducer {

    @ConfigProperty(name = "cloudinary.cloud-name")
    String cloudName;

    @ConfigProperty(name = "cloudinary.api-key")
    String apiKey;

    @ConfigProperty(name = "cloudinary.api-secret")
    String apiSecret;

    @Produces
    @ApplicationScoped
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
            "cloud_name", cloudName,
            "api_key",    apiKey,
            "api_secret", apiSecret,
            "secure",     true
        ));
    }
}