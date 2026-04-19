package config;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.enterprise.context.ApplicationScoped;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApplicationScoped
public class WorkosProperties {

	@ConfigProperty(name = "workos.client-id")
	private String workosClientId;
	
	@ConfigProperty(name = "workos.api-key")
	private String workosApiKey;
}
