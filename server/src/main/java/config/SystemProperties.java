package config;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.enterprise.context.ApplicationScoped;
import lombok.Data;

@Data
@ApplicationScoped
public class SystemProperties {

    @ConfigProperty(name = "frontend.base.url")
    private String webSuccessRedirect;
    
    @ConfigProperty(name = "login.redirect.url")
	private String loginRedirectUrl;
}
