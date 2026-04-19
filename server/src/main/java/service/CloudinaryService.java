package service;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.io.File;
import java.util.Map;

@ApplicationScoped
public class CloudinaryService {

    @Inject
    Cloudinary cloudinary;

    // Upload a file
    public Map uploadFile(File file) throws Exception {
        return cloudinary.uploader().upload(file, ObjectUtils.emptyMap());
    }

    // Upload with options (folder, public_id, etc.)
    public Map uploadWithOptions(File file, String folder, String publicId) throws Exception {
        return cloudinary.uploader().upload(file, Map.of(
            "folder",    folder,
            "public_id", publicId,
            "overwrite", true
        ));
    }

    // Get secure URL of an image
    public String getImageUrl(String publicId) {
        return cloudinary.url()
            .transformation(new com.cloudinary.Transformation()
                .width(300).height(300).crop("fill"))
            .generate(publicId);
    }

    // Delete a file
    public Map deleteFile(String publicId) throws Exception {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}