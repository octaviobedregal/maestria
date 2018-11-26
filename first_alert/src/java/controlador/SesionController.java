package controlador;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.dao.ISesionDao;
import modelo.dto.Sesion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Se encarga de administrar todos los controles de la sesion del usuario
 *
 * @author
 * @version 10/11/2018/A
 */
@Controller
public class SesionController {

    @Autowired
    JsonTransformer jsonTransformer;

    @Autowired
    ISesionDao sesionDao;

    /**
     * @param request Es la solicitud que viene desde el lada cliente
     * @param response Es la respuesta del servidor al lado cliente
     * @param nombre Es el nombre del usuario
     * @param clave El la clave del usuario
     */
    @RequestMapping(value = "/sesion/ingresar-sistema/{nombre}/{clave}", method = RequestMethod.GET, produces = "application/json")
    public void ingresarSistema(HttpServletRequest request, HttpServletResponse response, @PathVariable("nombre") String nombre, @PathVariable("clave") String clave) {
        try {
            Long id = sesionDao.validarUsuario(nombre, clave);
            if (id > 0) {
                Sesion sesion = sesionDao.cargarSesion(id);
                String body = jsonTransformer.toJson(sesion);
                response.setStatus(HttpServletResponse.SC_OK);
                response.setContentType("application/json; charset=UTF-8");
                response.getWriter().println(body);
            } else {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            }
        } catch (IOException ex) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ex.printStackTrace();
        }
    }

    /**
     * @param request Es la solicitud que viene desde el lada cliente
     * @param response Es la respuesta del servidor al lado cliente
     */
    @RequestMapping(value = "/cerrar-sesion", method = RequestMethod.GET)
    public void cerrarSesion(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.sendRedirect(request.getContextPath());
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
