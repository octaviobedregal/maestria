/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelo.dao;

import java.util.List;
import modelo.pojo.Emergencia;

/**
 *
 * @author octavio
 */
public interface IEmergenciaDao {

    public List<Emergencia> listarEmergencias(Long idMapa);

    public boolean guardarEmergencia(Long idMapa, List<Emergencia> emergenciass);

}
