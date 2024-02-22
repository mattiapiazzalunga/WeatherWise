# WeatherWise

A simple, but effective microservice weather web app

![Application Architecture](/documents/architecture.jpeg)

## Deployment Step 

First, GitClone of the project repository
```bash
git clone https://github.com/mattiapiazzalunga/WeatherWise.git
```
Move to directory K8s/prod 

```bash
cd K8s/prod
```
Clean and Execute minikube 
```bash
minikube stop
minikube delete
minikube start 
```
Install and apply the necessary add-on
```bash
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
```

Enable the ingress
```bash
minikube addons enable ingress
minikube addons enable ingress-dns
```

Run the following to build the application 
```bash
kubectl apply -f configMap/
kubectl apply -f secrets/
kubectl apply -f pvc/
kubectl apply -f deployment/
kubectl apply -f statefulsets/
kubectl apply -f deployment/
 kubectl apply -f services/
 ```

## Connect to the ApiGateway

Get minikube ip 
```bash
minikube ip
```

Get the real time weather of a  specified city 
```bash
 curl -i 192.168.49.2:32093/meteo/bergamo

HTTP/1.1 200 
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Date: Wed, 14 Feb 2024 01:13:47 GMT
Content-Type: application/json
Transfer-Encoding: chunked

{"description":null,"status":200,"data":{"name":"Bergamo","main":{"temp":6.71,"pressure":1022,"humidity":68,"temp_min":3.8,"temp_max":8.6},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}]}}
```

Determine the probability percentage indicating the reliability of the weather forecast.
```bash
curl -i 192.168.49.2:32093/feedbacks/percentage

HTTP/1.1 200 
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Date: Wed, 14 Feb 2024 01:15:01 GMT
Content-Type: application/json
Transfer-Encoding: chunked

50.004997

```

Get place of intrest of a specified city 
```bash
curl -i 192.168.49.2:32093/places/cities/bergamo
HTTP/1.1 200 
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Date: Wed, 14 Feb 2024 01:13:27 GMT
Content-Type: application/json
Transfer-Encoding: chunked

[{"commentId":9,"userName":"John","placeName":"Citta Alta","city":"Bergamo","description":"This is a great place to visit","rating":5},{"commentId":10,"userName":"John","placeName":"Cappella Colleoni","city":"Bergamo","description":"This is a great place to visit","rating":5},
...
]
```


