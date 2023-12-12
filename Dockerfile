FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app
EXPOSE 8080
#docker run --name dev2 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:latest "DOCKER KURULUM!!! "Posgtre 5432 de çalışıyor""
#docker build -t aydincagrihan/reactivitiesv2 .     "Docker build işlemleri"
#docker run --rm -it -p 8080:80 aydincagrihan/reactivitiesv2
#docker giriş=>> docker login
#docker push => docker push aydincagrihan/reactivitiesv2:latest
# copy .csproj and restore as distinct layers
COPY "Reactivities.sln" "Reactivities.sln"
COPY "API/API.csproj" "API/API.csproj"
COPY "Application/Application.csproj" "Application/Application.csproj"
COPY "Persistence/Persistence.csproj" "Persistence/Persistence.csproj"
COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"

RUN dotnet restore "Reactivities.sln"

# copy everything else and build
COPY . .
WORKDIR /app
RUN dotnet publish -c Release -o out

# build a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "API.dll" ]