CREATE DATABASE snmp_monitor;

CREATE TABLE snmp_monitor.groups (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1023),
    PRIMARY KEY (id)
);

CREATE TABLE snmp_monitor.devices (
    id INT NOT NULL AUTO_INCREMENT,
    group_id int NOT NULL,
    name VARCHAR(255) NOT NULL,
    ip VARCHAR(16) NOT NULL,
    unit VARCHAR(32),
    oid VARCHAR(255) NOT NULL,
    backup_oid VARCHAR(255) NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE snmp_monitor.log (
    device_id INT NOT NULL,
    ts TIMESTAMP DEFAULT NOW(),
    value VARCHAR(255)
);