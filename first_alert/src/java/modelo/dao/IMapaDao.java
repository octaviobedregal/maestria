/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao;

import java.util.List;
import modelo.pojo.Mapa;

/**
 *
 * @author octavio
 */
public interface IMapaDao {

    public void guardarMapa(Mapa mapa);

    public Mapa buscarMapaPorId(long idMapa);

    public Mapa buscarMapaPorCodigo(String codigoNodo);

    public boolean eliminarMapa(long id);

    public List<Mapa> listarMapas();

    public List<Long> buscarRutaCritica(String codigoNodo);
}
