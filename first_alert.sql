
DROP TABLE IF EXISTS emergencia;
DROP TABLE IF EXISTS camino;
DROP TABLE IF EXISTS nodo;
DROP TABLE IF EXISTS mapa;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS companhia;


CREATE TABLE companhia (
    id BIGSERIAL NOT NULL,
    nombre CHARACTER VARYING NOT NULL
);

CREATE TABLE rol (
    id BIGSERIAL NOT NULL,
    descripcion CHARACTER VARYING NOT NULL
);

CREATE TABLE usuario (
    id BIGSERIAL NOT NULL,
    nombre CHARACTER VARYING NOT NULL,
    numero INTEGER NOT NULL,
    ID_companhia BIGINT NOT NULL,
    id_rol BIGINT NOT NULL
);

CREATE TABLE mapa (
    id BIGSERIAL NOT NULL,
    path CHARACTER VARYING NOT NULL,
    nombre CHARACTER VARYING NOT NULL,
    descripcion CHARACTER VARYING NOT NULL,
    id_companhia BIGINT NOT NULL
);

CREATE TABLE nodo (
    id BIGSERIAL NOT NULL,
    id_mapa BIGINT NOT NULL,
    numero INTEGER NOT NULL,
    codigo CHARACTER VARYING NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    objetivo BOOLEAN NOT NULL
);


CREATE TABLE camino (
    id BIGSERIAL NOT NULL,
    id_mapa BIGINT NOT NULL,
    id_nodo_inicio BIGINT NOT NULL,
    id_nodo_fin BIGINT NOT NULL,
    peso INTEGER NOT NULL
);

CREATE TABLE emergencia (
    id BIGSERIAL NOT NULL,
    id_mapa BIGINT NOT NULL,
    id_nodo BIGINT NOT NULL,
    fecha TIMESTAMP NOT NULL
);

ALTER TABLE companhia ADD CONSTRAINT PK_companhia PRIMARY KEY (id);
ALTER TABLE rol ADD CONSTRAINT PK_rol PRIMARY KEY (id);
ALTER TABLE usuario ADD CONSTRAINT PK_usuario PRIMARY KEY (id);
ALTER TABLE mapa ADD CONSTRAINT PK_mapa PRIMARY KEY (id);
ALTER TABLE nodo ADD CONSTRAINT PK_nodo PRIMARY KEY (id);
ALTER TABLE camino ADD CONSTRAINT PK_camino PRIMARY KEY (id);
ALTER TABLE emergencia ADD CONSTRAINT PK_emergencia PRIMARY KEY (id);



ALTER TABLE usuario ADD CONSTRAINT FK_usuario_companhia FOREIGN KEY (id_companhia) REFERENCES companhia(id);
ALTER TABLE usuario ADD CONSTRAINT FK_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id);
ALTER TABLE mapa ADD CONSTRAINT FK_mapa_companhia FOREIGN KEY (id_companhia) REFERENCES companhia(id);
ALTER TABLE nodo ADD CONSTRAINT FK_nodo_mapa FOREIGN KEY (id_mapa) REFERENCES mapa(id);
ALTER TABLE camino ADD CONSTRAINT FK_camino_nodo_mapa FOREIGN KEY (id_mapa) REFERENCES mapa(id);
ALTER TABLE camino ADD CONSTRAINT FK_camino_nodo_inicio FOREIGN KEY (id_nodo_inicio) REFERENCES nodo(id);
ALTER TABLE camino ADD CONSTRAINT FK_camino_nodo_fin FOREIGN KEY (id_nodo_fin) REFERENCES nodo(id);
ALTER TABLE emergencia ADD CONSTRAINT FK_emergencia_mapa FOREIGN KEY (id_mapa) REFERENCES mapa(id);
ALTER TABLE emergencia ADD CONSTRAINT FK_emergencia_nodo FOREIGN KEY (id_nodo) REFERENCES nodo(id);



INSERT INTO companhia(nombre)
 VALUES ('Compañia 1');

 insert into public.mapa (descripcion, id_companhia, nombre, path) values ('', 1,'', '');
