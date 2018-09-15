package controlador;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.dao.IEmergenciaDao;
import modelo.pojo.Emergencia;
import modelo.pojo.Mapa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmergenciaController {

    @Autowired
    JsonTransformer jsonTransformer;

    @Autowired
    IEmergenciaDao emergenciaDao;

    @RequestMapping(value = "/emergencia/listar/{idMapa}", method = RequestMethod.GET, produces = "application/json")
    public void listar(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @PathVariable("idMapa") long idMapa) throws IOException {
        PrintWriter out = httpServletResponse.getWriter();
        try {
            List<Emergencia> lista = emergenciaDao.listar(idMapa);
            String jsonSalida = jsonTransformer.toJson(lista);
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setContentType("application/json; charset=UTF-8");

            out.println(jsonSalida);

        } catch (Exception ex) {
            ex.printStackTrace();
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println("{\"RSP\":\"ERROR\",\"MSG\":\"" + ex.getMessage() + "\"}");
        }

    }

    @RequestMapping(value = "/emergencia/crear-emergencia", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public void crearEmergencia(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @RequestBody String jsonEntrada) {
        try {
            Emergencia[] array = (Emergencia[]) jsonTransformer.fromJson(jsonEntrada, Emergencia[].class);

            List<Emergencia> emergencias = Arrays.asList(array);
            System.out.println(jsonTransformer.toJson(emergencias));

            emergenciaDao.crear(emergencias);
            if (emergencias.get(0).getId() > 0) {
                String jsonSalida = jsonTransformer.toJson(emergencias);
                httpServletResponse.setStatus(HttpServletResponse.SC_OK);
                httpServletResponse.setContentType("application/json; charset=UTF-8");
                httpServletResponse.getWriter().println(jsonSalida);
            } else {
                String jsonSalida = jsonTransformer.toJson(emergencias);
                httpServletResponse.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
                httpServletResponse.setContentType("application/json; charset=UTF-8");
                httpServletResponse.getWriter().println(jsonSalida);
            }

        } catch (Exception ex) {
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.setContentType("text/plain; charset=UTF-8");
            ex.printStackTrace();
        }
    }
}
