FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY . .
RUN ls -R
RUN dotnet restore todo-app/backend/todo/todo/todo.csproj
RUN dotnet publish todo-app/backend/todo/todo/todo.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "todo.dll"]