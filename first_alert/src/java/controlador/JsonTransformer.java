package controlador;

public interface JsonTransformer {
    String toJson(Object data);
    String toJson2(Object data);
    Object fromJson(String json, Class clazz);
}
