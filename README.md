# Komik-API-V2

### Download Postman Collection Here
<a href="https://drive.google.com/file/d/19SVbafOtxqU121R_mhH1IhdWDyJjdc_6/view?usp=sharing">Postman Komik-API</a>

### Download Environtment Postman Here
<a href="https://drive.google.com/file/d/1xotuISX2q0wiF5ahwbntVgy0cYXe_Vyx/view?usp=sharing">Environtment Komik-API</a>

## Build your Docker Images
```bash
docker build -t komik-api .
```

## Show Docker Images
```bash
docker images
```

## Start Docker Images as Container
```bash
docker run --publish 5000:5000 komik-api
```

## Start Docker Images as Container on Hide CLI
```bash
docker run -d -p 5000:5000 komik-api
```
