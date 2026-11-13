BEGIN;
-- 1. Tablica korisnika (organizatora anketa)
CREATE TABLE korisnik (
    email VARCHAR(255) PRIMARY KEY,
    ime VARCHAR(100) NOT NULL,
    prezime VARCHAR(100) NOT NULL,
    lozinka VARCHAR(255) NOT NULL,
    vremenska_zona INT DEFAULT 0
);

-- 2. Tablica šifarnik ankete
CREATE TABLE status_ankete (
    status_id VARCHAR(50) PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL,
    opis TEXT
);

-- 3. Tablica anketa
CREATE TABLE anketa (
    anketa_id SERIAL PRIMARY KEY,
    email_organizatora VARCHAR(255) NOT NULL,
    naslov VARCHAR(255) NOT NULL,
    opis TEXT,
    lokacija VARCHAR(255),
    status_id VARCHAR(50) NOT NULL,
    datum_stvaranja TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    postavke JSONB,
    CONSTRAINT fk_anketa_organizator FOREIGN KEY (email_organizatora) REFERENCES korisnik(email) ON DELETE CASCADE,
    CONSTRAINT fk_anketa_status FOREIGN KEY (status_id) REFERENCES status_ankete(status_id)
);

-- 4. Tablica termina
CREATE TABLE termin (
    termin_id SERIAL PRIMARY KEY,
    anketa_id INT NOT NULL,
    vrijeme_pocetka TIMESTAMPTZ NOT NULL,
    vrijeme_kraja TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_termin_anketa FOREIGN KEY (anketa_id) REFERENCES anketa(anketa_id) ON DELETE CASCADE,
    CONSTRAINT chk_vrijeme_termina CHECK (vrijeme_kraja > vrijeme_pocetka)
);

-- 5. Tablica sudionika
CREATE TABLE sudionik (
    sudionik_id SERIAL PRIMARY KEY,
    ime VARCHAR(100) NOT NULL,
    email VARCHAR(255)
);

-- 6. Tablica mogućih odgovora ("Da", "Ne", "Ako mora", "Možda")
CREATE TABLE odgovor (
    odgovor_id SERIAL PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL
);

-- 7. Poveznica ankete i ponuđenih odgovora
CREATE TABLE anketa_odgovor (
    anketa_odgovor_id SERIAL PRIMARY KEY,
    anketa_id INT NOT NULL,
    odgovor_id INT NOT NULL,
    CONSTRAINT fk_ao_anketa FOREIGN KEY (anketa_id) REFERENCES anketa(anketa_id) ON DELETE CASCADE,
    CONSTRAINT fk_ao_odgovor FOREIGN KEY (odgovor_id) REFERENCES odgovor(odgovor_id) ON DELETE CASCADE,
    CONSTRAINT unq_anketa_odgovor UNIQUE (anketa_id, odgovor_id)
);

-- 8. Tablica glasova
CREATE TABLE glas (
    glas_id SERIAL PRIMARY KEY,
    sudionik_id INT NOT NULL,
    termin_id INT NOT NULL,
    anketa_odgovor_id INT NOT NULL,
    datum_izmjene TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    komentar TEXT,
    CONSTRAINT fk_glas_sudionik FOREIGN KEY (sudionik_id) REFERENCES sudionik(sudionik_id) ON DELETE CASCADE,
    CONSTRAINT fk_glas_termin FOREIGN KEY (termin_id) REFERENCES termin(termin_id) ON DELETE CASCADE,
    CONSTRAINT fk_glas_anketa_odgovor FOREIGN KEY (anketa_odgovor_id) REFERENCES anketa_odgovor(anketa_odgovor_id) ON DELETE CASCADE,
    CONSTRAINT unq_sudionik_termin UNIQUE (sudionik_id, termin_id)
);
COMMIT;