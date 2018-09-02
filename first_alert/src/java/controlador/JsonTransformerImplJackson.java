package controlador;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.hibernate4.Hibernate4Module;
import java.io.IOException;
import static org.hibernate.EntityMode.POJO;

public class JsonTransformerImplJackson implements JsonTransformer {

    @Override
    public String toJson(Object data) {
        try {

            ObjectMapper objectMapper = new ObjectMapper();

            Hibernate4Module hbm = new Hibernate4Module();
            hbm.enable(Hibernate4Module.Feature.FORCE_LAZY_LOADING);
            hbm.disable(Hibernate4Module.Feature.USE_TRANSIENT_ANNOTATION);
            //hbm.enable(Hibernate4Module.Feature.SERIALIZE_IDENTIFIER_FOR_LAZY_NOT_LOADED_OBJECTS);

            objectMapper.registerModule(hbm);
            //objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            //objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            //objectMapper.setSerializationInclusion(Include.NON_NULL);
            //objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            //objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
            //objectMapper.registerModule(new Hibernate4Module());
            return objectMapper.writeValueAsString(data);
        } catch (JsonProcessingException ex) {
            ex.printStackTrace();
            throw new RuntimeException(ex);
        }
    }

        @Override
    public String toJson2(Object data) {
        try {

            ObjectMapper objectMapper = new ObjectMapper();

            //Hibernate4Module hbm = new Hibernate4Module();
            //hbm.enable(Hibernate4Module.Feature.FORCE_LAZY_LOADING);
            //hbm.disable(Hibernate4Module.Feature.USE_TRANSIENT_ANNOTATION);
            //hbm.enable(Hibernate4Module.Feature.SERIALIZE_IDENTIFIER_FOR_LAZY_NOT_LOADED_OBJECTS);

            //objectMapper.registerModule(hbm);
            //objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            //objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            //objectMapper.setSerializationInclusion(Include.NON_NULL);
            //objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            //objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
            //objectMapper.registerModule(new Hibernate4Module());
            return objectMapper.writeValueAsString(data);
        } catch (JsonProcessingException ex) {
            ex.printStackTrace();
            throw new RuntimeException(ex);
        }
    }

    @Override
    public Object fromJson(String json, Class clazz) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            //objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            return objectMapper.readValue(json, clazz);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

}
