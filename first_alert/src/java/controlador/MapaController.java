package controlador;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.dao.IMapaDao;
import modelo.dao.impl.MapaDao;
import modelo.dao.impl.NodoA;
import modelo.dao.impl.PathClass;
import modelo.pojo.Mapa;
import modelo.pojo.Nodo;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MapaController {

    @Autowired
    JsonTransformer jsonTransformer;

    @Autowired
    IMapaDao mapaDao;

    @RequestMapping(value = "/mapa/listar", method = RequestMethod.GET, produces = "application/json")
    public void listar(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        PrintWriter out = httpServletResponse.getWriter();
        try {
            List<Mapa> lista = mapaDao.listar();
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

    @RequestMapping(value = "/mapa/crear", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public void crear(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @RequestBody String jsonEntrada) {
        try {
            Mapa mapa = (Mapa) jsonTransformer.fromJson(jsonEntrada, Mapa.class);

            System.out.println(jsonTransformer.toJson(mapa));

            mapaDao.crear(mapa);
            if (mapa.getId() > 0) {
                String jsonSalida = jsonTransformer.toJson(mapa);
                httpServletResponse.setStatus(HttpServletResponse.SC_OK);
                httpServletResponse.setContentType("application/json; charset=UTF-8");
                httpServletResponse.getWriter().println(jsonSalida);
            } else {
                String jsonSalida = jsonTransformer.toJson(mapa);
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

    /**
     * @param request Es la solicitud que viene desde el lada cliente
     * @param response Es la respuesta del servidor al lado cliente
     * @param id Es el identificador de un usuario
     */
    @RequestMapping(value = "/mapa/buscar/{id}", method = RequestMethod.GET, produces = "application/json")
    public void buscarUsuario(HttpServletRequest request, HttpServletResponse response, @PathVariable("id") long id) {
        try {
            //sesionController.crearLogUsuario(request, response, "buscarUsuario", Long.toString(id));
            Mapa mapa = mapaDao.buscar(id);
            String body = jsonTransformer.toJson(mapa);
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().println(body);
        } catch (IOException ex) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ex.printStackTrace();
        }
    }

    @RequestMapping(value = "/mapa/ver-imagen/{id}", method = RequestMethod.GET)
    public void getImageAsByteArray(HttpServletResponse response, @PathVariable("id") long id) throws IOException {
        File initialFile = new File("D:\\MUNI\\" + id + ".png");
        InputStream in = new FileInputStream(initialFile);
        response.setContentType(MediaType.IMAGE_JPEG_VALUE);
        IOUtils.copy(in, response.getOutputStream());
    }

    @RequestMapping(value = "/mapa/editar", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public void editar(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @RequestBody String jsonEntrada) throws IOException {
        PrintWriter out = httpServletResponse.getWriter();
        try {
            Mapa mapa = (Mapa) jsonTransformer.fromJson(jsonEntrada, Mapa.class);
            mapaDao.editar(mapa);
            String jsonSalida = jsonTransformer.toJson(mapa);
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

    @RequestMapping(value = "/mapa/eliminar/{id}", method = RequestMethod.POST, produces = "application/json")
    public void eliminar(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @PathVariable("id") long id) throws IOException {
        PrintWriter out = httpServletResponse.getWriter();
        try {
            mapaDao.eliminar(id);
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println(id);
        } catch (Exception ex) {
            ex.printStackTrace();
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println("{\"RSP\":\"ERROR\",\"MSG\":\"" + ex.getMessage() + "\"}");
        }
    }

    @RequestMapping(value = "/mapa/buscar-ruta-critica/{codigo}", method = RequestMethod.GET, produces = "application/json")
    public void buscarRutaCritica(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @PathVariable("codigo") String codigo) throws IOException {
        PrintWriter out = httpServletResponse.getWriter();
        try {
            List<NodoA> result = mapaDao.buscarRutaCritica(codigo);
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println(jsonTransformer.toJson(result));
        } catch (Exception ex) {
            ex.printStackTrace();
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println("{\"RSP\":\"ERROR\",\"MSG\":\"" + ex.getMessage() + "\"}");
        }
    }

}
