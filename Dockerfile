FROM eclipse-temurin:21-jre-alpine

# Criar usuario e grupo de sistema nao-root para seguranca de producao
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Copiar o binario compilado e atribuir permissao ao usuario spring
COPY --chown=spring:spring target/e-commerceAPI-0.0.1-SNAPSHOT.jar app.jar

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]