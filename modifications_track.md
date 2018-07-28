On 28/07/2018 :

in package.lock.json, I've update the version of Hoek after getting message in Github :

 > We found a potential security vulnerability in one of your dependencies.
> A dependency defined in package-lock.json has known security vulnerabilities and should be updated.

> Only the owner of this repository can see this message.
> Learn more about vulnerability alerts

previous version : "hoek": "2.16.3"

> Known vulnerability found
CVE-2018-3728
Moderate severity
hoek node module before 5.0.3 or 4.2.1 suffers from a Modification of Assumed-Immutable Data (MAID) vulnerability via...

> package-lock.json update suggested:
hoek ~> 4.2.1

