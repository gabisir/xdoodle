-- pocetni izmisljeni podatci, obrisati kasnije kada se osposobi oboje read i write na bazu

INSERT INTO korisnik (email, ime, prezime, lozinka, vremenska_zona) VALUES
('ana.anic@gmail.com', 'Ana', 'Anić', 'hash_lozinke_1', 1),
('ivo.ivic@gmail.com', 'Ivo', 'Ivić', 'hash_lozinke_2', 1),
('maja.majić@gmail.com', 'Maja', 'Majić', 'hash_lozinke_3', 2);

INSERT INTO status_ankete (status_id, naziv, opis) VALUES
('ACTIVE', 'Aktivna', 'Anketa je otvorena za glasovanje'),
('CLOSED', 'Zatvorena', 'Glasovanje je završeno'),
('DRAFT', 'Nacrt', 'Anketa još nije objavljena');

INSERT INTO anketa (email_organizatora, naslov, opis, lokacija, status_id, postavke) VALUES
('ana.anic@gmail.com', 'Planiranje timskog roštilja', 'Dogovaramo se za vikend roštilj na Jarunu.', 'Jarun, Zagreb', 'ACTIVE', '{"sakrij_glasove": false, "max_glasova": 2}'),
('ivo.ivic@gmail.com', 'Sastanak projektnog tima', 'Usklađivanje rokova za Q3.', 'Ured / Online', 'ACTIVE', '{"sakrij_glasove": true, "max_glasova": 1}'),
('maja.majić@gmail.com', 'Filmska večer', 'Koji film gledamo ovaj tjedan?', 'Kod Maje', 'DRAFT', NULL);

INSERT INTO termin (anketa_id, vrijeme_pocetka, vrijeme_kraja) VALUES
(1, '2026-06-15 15:00:00+02', '2026-06-15 20:00:00+02'),
(1, '2026-06-16 16:00:00+02', '2026-06-16 21:00:00+02'),
(2, '2026-06-10 10:00:00+02', '2026-06-10 11:00:00+02'),
(2, '2026-06-11 10:00:00+02', '2026-06-11 11:00:00+02');

INSERT INTO sudionik (ime, email) VALUES
('Pero Perić', 'pero@peric.hr'),
('Luka', NULL),
('A', 'ana.anic@gmail.com'),
('K', NULL);

INSERT INTO odgovor (naziv) VALUES
('Da'),
('Ne'),
('Možda'),
('Ako mora');

INSERT INTO anketa_odgovor (anketa_id, odgovor_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(2, 3);

INSERT INTO glas (sudionik_id, termin_id, anketa_odgovor_id, komentar) VALUES
(1, 1, 1, 'Možda kasnim do 10 minuta'),
(2, 1, 2, 'Ne odgovara mi taj dan.'),
(3, 3, 1, ''),
(4, 4, 3, 'Može, ali malo kasnije.');