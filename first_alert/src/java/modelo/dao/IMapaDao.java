/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao;

import java.util.List;
import modelo.dao.impl.NodoA;
import modelo.pojo.Mapa;

/**
 *
 * @author octavio
 */
public interface IMapaDao {

    public void crear(Mapa producto);

    public void editar(Mapa producto);

    public Mapa buscar(long id);

    public void eliminar(long id);

    public List<Mapa> listar();

    public List<Mapa> autocompletar(String criterio);

    public List<NodoA> buscarRutaCritica(String codigoNodo);
}
