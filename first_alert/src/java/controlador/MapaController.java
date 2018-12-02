package controlador;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import modelo.dao.IMapaDao;
import modelo.dao.impl.GlobalCache;
import modelo.pojo.Mapa;
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

    @RequestMapping(value = "/mapa/listar-mapas", method = RequestMethod.GET, produces = "application/json")
    public void listar(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        PrintWriter out = httpServletResponse.getWriter();
        try {
            List<Mapa> lista = mapaDao.listarMapas();
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

    @RequestMapping(value = "/mapa/guardar-mapa", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    public void crearMapa(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @RequestBody String jsonEntrada) {
        try {
            Mapa mapa = (Mapa) jsonTransformer.fromJson(jsonEntrada, Mapa.class);

            System.out.println(jsonTransformer.toJson(mapa));

            mapaDao.guardarMapa(mapa);
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
    @RequestMapping(value = "/mapa/buscar-mapa-por-id/{id}", method = RequestMethod.GET, produces = "application/json")
    public void buscarUsuario(HttpServletRequest request, HttpServletResponse response, @PathVariable("id") long id) {
        try {
            //sesionController.crearLogUsuario(request, response, "buscarUsuario", Long.toString(id));
            Mapa mapa = mapaDao.buscarMapaPorId(id);
            String body = jsonTransformer.toJson(mapa);
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().println(body);
        } catch (IOException ex) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ex.printStackTrace();
        }
    }

    @RequestMapping(value = "/mapa/ver-imagen/{imagen}", method = RequestMethod.GET)
    public void getImageAsByteArray(HttpServletResponse response, @PathVariable("imagen") String imagen) throws IOException {
        File initialFile = new File(GlobalCache.PATH_IMAGENES + imagen+".png");
        InputStream in = new FileInputStream(initialFile);
        response.setContentType(MediaType.IMAGE_JPEG_VALUE);
        IOUtils.copy(in, response.getOutputStream());
    }

    @RequestMapping(value = "/mapa/eliminar-mapa/{id}", method = RequestMethod.GET, produces = "application/json")
    public void eliminar(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @PathVariable("id") long id) throws IOException {
        PrintWriter out = httpServletResponse.getWriter();
        try {
            boolean eliminado = mapaDao.eliminarMapa(id);
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println(eliminado);
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
            List<Long> rutaCritica = mapaDao.buscarRutaCritica(codigo);
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println(jsonTransformer.toJson(rutaCritica));
        } catch (Exception ex) {
            ex.printStackTrace();
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println("{\"RSP\":\"ERROR\",\"MSG\":\"" + ex.getMessage() + "\"}");
        }
    }

    @RequestMapping(value = "/mapa/buscar-mapa-por-codigo-nodo/{codigo}", method = RequestMethod.GET, produces = "application/json")
    public void buscarMapaPorCodigo(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, @PathVariable("codigo") String codigo) throws IOException {
        PrintWriter out = httpServletResponse.getWriter();
        try {
            Mapa mapa = mapaDao.buscarMapaPorCodigo(codigo);
            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println(jsonTransformer.toJson(mapa));
        } catch (Exception ex) {
            ex.printStackTrace();
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.setContentType("application/json; charset=UTF-8");
            out.println("{\"RSP\":\"ERROR\",\"MSG\":\"" + ex.getMessage() + "\"}");
        }
    }
}
