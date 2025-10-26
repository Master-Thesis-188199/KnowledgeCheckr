FROM alpine:3.20 AS setup

COPY ./drizzle ./drizzle
COPY ./compose-init-script.sh .

RUN chmod +x ./compose-init-script.sh
RUN ./compose-init-script.sh drizzle schema/init.sql

# Stage 2: MySQL image with init.sql
FROM mysql:latest
COPY --from=setup schema/init.sql /docker-entrypoint-initdb.d/001-init.sql