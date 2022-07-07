# DNS configuration default server
# Table of contents
  * [Domains](#domains)
    + [A records](#a-records)
  * [Email](#email)
    + [TXT records](#txt-records)
      - [DKIM](#dkim)
      - [DMARC](#dmarc)
      - [SPF](#spf)
      - [BIMI](#bimi)
    + [MX records](#mx-records)
    + [CNAME records](#cname-records)
      - [DKIM](#dkim-1)
  * [Verification](#verification)
    + [TXT records](#txt-records-1)
## Domains
### A records
**MAIN domain**
```
example.com
```
```
status.example.com
```
**HR domain**
```
hr.example.com
```
**ADM domain**
```
adm.example.com
```
**STATIC CONTENT domain**
```
static.example.com
```
```
status.static.example.com
```
**MICRO SERVICE domain**
```
micro.example.com
```
```
status.micro.example.com
```
**PROXY domain**
```
proxy.example.com
```
```
status.proxy.example.com
```
**DATABASE domain**
```
db.example.com
```
**API domain**
```
api.example.com
```
**GRAFANA domain**
```
grafana.example.com
```
**PROMETHEUS domain**
```
prometheus.example.com
```
## Email
### TXT records
#### DKIM 
>DomainKeys Identified Mail is an email authentication method designed to detect forged sender addresses in email (email spoofing), a technique often used in phishing and email spam.

**Amazon SES**
```
mail._domainkey.example.com ::: v=DKIM1; k=rsa; t=s; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCb9cnc3nQOOXazaSs8H7m8t25XNQ7gT6V9/Vl50L6ptM+N9ZNtspG1+CPDuAWirQ1L6hVSE259gKqVM30FoEi7pgn5BQ9fvgUmkUDQuEiOJAA5BzitZl09eMjyesNf89Q4dQz0/xBsmYPToppV3RM4vd7LBEK/mqNKwckRoJC5OQIDAQAB
```
#### DMARC
>Domain-based Message Authentication, Reporting and Conformance is an email authentication protocol. It is designed to give email domain owners the ability to protect their domain from unauthorized use, commonly known as email spoofing. 
```
_dmarc.example.com ::: v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com
```
#### SPF
>Sender Policy Framework is an email authentication method designed to detect forging sender addresses during the delivery of the email.

**Yandex 360**
```
@.example.com ::: v=spf1 redirect=_spf.yandex.net
```
**Amazon SES**
```
send.example.com ::: v=spf1 include:amazonses.com ~all
```
#### BIMI
>Brand Indicators for Message Identification  is an emerging email specification that enables the use of brand-controlled logos within supporting email clients.

**Yandex 360**
```
default._bimi.example.com ::: v=BIMI1; l=https://example.com/logo.svg
```
**Amazon SES**
```
default._bimi.send.example.com ::: v=BIMI1; l=https://example.com/logo.svg
```
---
### MX records
**Amazon SES**
```
send.example.com ::: feedback-smtp.eu-central-1.amazonses.com
```
**Yandex 360**
```
@.example.com ::: mx.yandex.net
```
---
### CNAME records
#### DKIM 
**Amazon SES**
```
mckqs5fca3it2qubsodjrze5su6p7jzu._domainkey.example.com ::: mckqs5fca3it2qubsodjrze5su6p7jzu.dkim.amazonses.com
```
```
moji63o3z56ciwdyxkw6jxl63h2qzqcs._domainkey.example.com ::: moji63o3z56ciwdyxkw6jxl63h2qzqcs.dkim.amazonses.com
```
```
3bu2sweokti34s553zqmbcwlnjj3qgv3._domainkey.example.com ::: 3bu2sweokti34s553zqmbcwlnjj3qgv3.dkim.amazonses.com
```
## Verification
### TXT records
**Yandex 360**
```
@.example.com ::: yandex-verification: 6ef7aa5a0da3a867
```
**Google**
```
@.example.com ::: google-site-verification=4b06Pr1TR7NftS5VNN4WKEPR79AZI4J4c1VkJsHORyM
```
