# ❄️Snowly - TR

Snowly Frontend, modern web teknolojileri kullanılarak geliştirilmiş kullanıcı dostu bir arayüz uygulamasıdır.

Kullanıcılar arası iletişimi sağlamak, mesaj yönetimini gerçekleştirmek amacıyla backende istek için tasarlanmıştır

## Özellikler
* Hızlı ve optimize edilmiş performans
* Modern ve responsive tasarım
* Modüler ve ölçeklenebilir yapı
* API entegrasyonlarına hazır yapı
* Mobil uyumlu (responsive design)

## Kullanılan Teknolojiler
* JavaScript
* React
* React Router DOM (Sayfa yönlendirmeleri)
* Vite
* CSS
* Axios (API istekleri için)
* Progressive Web App (PWA kullanılabilir) (Ana ekrana eklenebilir)

## Yayınlama
Proje Netlify kullanılarak yayına alınmıştır. Aşağıdaki linkten ulaşılabilir

https://snowlychat.netlify.app/anasayfa

## Proje Düzeni
<img width="300" height="800" alt="Ekran görüntüsü 2026-04-15 155124" src="https://github.com/user-attachments/assets/ffe24fe4-c788-4478-a8b0-282ed3dc800e" />

## Sayfa Yönetimi ve Routing

Projede sayfa yönetimi, React Router DOM kullanılarak gerçekleştirilmiştir.

* Sayfalar birbirinden bağımsız şekilde yapılandırılmıştır
* Route tanımlamaları merkezi olarak yönetilmektedir
* Dinamik yönlendirme (navigation) desteklenmektedir
* Uygulama, Single Page Application (SPA) mimarisine uygun olarak geliştirilmiştir

<img width="234" height="82" alt="Ekran görüntüsü 2026-04-15 160853" src="https://github.com/user-attachments/assets/0b651369-9ff2-403c-b5c4-bd85477e0961" />

## API Yönetimi ve Context Kullanımı

Bu projede API istekleri, merkezi bir yapı sağlamak amacıyla Context API içerisinde yönetilmektedir.

Provider yapısı kullanılarak:

* API çağrıları tek bir noktada toplanmıştır
* Veri akışı merkezi hale getirilmiştir
* Component’lerin doğrudan API ile iletişimi azaltılmıştır
* Daha temiz ve sürdürülebilir bir kod yapısı elde edilmiştir

<img width="236" height="90" alt="Ekran görüntüsü 2026-04-15 154529" src="https://github.com/user-attachments/assets/37179dfa-6dd0-4fba-a925-2eb19ecea06d" />

---

API işlemleri belirlenmiş Context Provider içerisinde tasarlanmıştır

<img width="573" height="344" alt="image" src="https://github.com/user-attachments/assets/3abe3fbb-2518-415a-ae3f-02ac6ad742b1" />

## Sayfalar ve Kullanım

**Giriş Sayfası**

<img width="300" height="500" alt="IMG_5414" src="https://github.com/user-attachments/assets/4a0884d5-80a8-4268-bfc8-e74a70c1c1c8" />

---

**Kayıt Sayfası**

<img width="300" height="500" alt="IMG_5415" src="https://github.com/user-attachments/assets/c148e54d-aa00-41ad-b312-f074a1275b1f" />

---

**Sohbetler**

Tüm sohbetler burada görünür

<img width="300" height="500" alt="IMG_5417" src="https://github.com/user-attachments/assets/1f291590-5cd9-4ffc-8d83-a4f69d63158a" />

---

**Arkadaşlar**

Arkadaşlık kurduğunuz kişiler burada listelenir. Direkt mesajlara gidebilir veya arkadaşlıktan çıkarabilirsiniz

<img width="300" height="500" alt="IMG_5419" src="https://github.com/user-attachments/assets/0fa67167-9df1-4329-9ae2-1d8fff4456f7" />

---

**Arkadaş ekleme ekranı**

Arkadaş eklemek istediğiniz kullanıcının E-posta adresi ile arama yaparak kullanıcıya istek gönderebilirsiniz

<img width="300" height="500" alt="IMG_5420" src="https://github.com/user-attachments/assets/691a65b0-c0e1-42ce-9d83-5e65dbf322b6" />

---

**Gelen ve gönderilen arkadaşlık isteği ekranı**

Arkadaşlık isteği gönderdiğiniz ve size gelen arkadaşlık isteklerini görüntüleyebilir ve kabul - red olarak seçim yapabilirsiniz

<img width="300" height="500" alt="IMG_5421" src="https://github.com/user-attachments/assets/a2fbfb5f-24d4-4545-a5fb-bbfd9ed91c14" />

---

**Mesajlaşma sohbet ekranı**

* Kullanıcılar arasında mesajlaşma ekranıdır
* Burada görünen mesajlar sadece kullanıcılar arasında görülür. Veritabanında şifrelenmiş şekilde depolanır ve istek anında backend şifresini açarak mesajları getirir
* Kullanıcının çevrimiçi olup olmadığı SignalR üzerindeki bağlantıdan alınarak anlık olarak gösterilir

<img width="300" height="500" alt="IMG_5416" src="https://github.com/user-attachments/assets/d1b4f269-59d8-479c-a491-c1382055fdb4" />

---

**Ayarlar**

Kullanıcılar İsim - Soyisim ve Şifrelerini kolayca değiştirebilirler

<img width="300" height="500" alt="IMG_5422" src="https://github.com/user-attachments/assets/43aa3ceb-9050-4d72-b2bf-59eb8564e6a5" />








  
