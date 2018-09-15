package modelo.pojo;
// Generated 01-sep-2018 18:24:08 by Hibernate Tools 4.3.1

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * Emergencia generated by hbm2java
 */
@Entity
@Table(name = "emergencia", schema = "public"
)
public class Emergencia implements java.io.Serializable {

    private Long id;
    private Long idMapa;
    private Long idNodo;
    private Date fecha;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "id_mapa", nullable = false)
    public Long getIdMapa() {
        return this.idMapa;
    }

    public void setIdMapa(Long idMapa) {
        this.idMapa = idMapa;
    }

    @Column(name = "id_nodo", nullable = false)
    public Long getIdNodo() {
        return this.idNodo;
    }

    public void setIdNodo(Long idNodo) {
        this.idNodo = idNodo;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha", nullable = false, length = 29)
    public Date getFecha() {
        return this.fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

}