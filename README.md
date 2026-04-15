# Snowly - TR

Snowly Frontend, gerçek zamanlı mesajlaşma programımının ön yüzüdür
Kullanıcılar arası iletişimi sağlamak, mesaj yönetimini gerçekleştirmek amacıyla backende istek için tasarlanmıştır

## Özellikler

* Gerçek zamanlı mesajlaşma altyapısı (SignalR ile sağlıyorum)
* Kullanıcı yönetimi
* Kimlik doğrulama ve yetkilendirme (JWT kullandım)
* RESTful API (Uygulamanın dışarıya açılması için API yapısı kurdum)
* Veritabanı entegrasyonu (PostgreSQL kullandım ve veritabanımı Neon.com üzerinden oluşturdum)
* MediatR kütüphanesini kullandım (Her işlem için özel handlerlar yazmak geliştirilmeyi esnek hale getiriyor)

## Kullanılan Teknolojiler

* .NET Core (WebAPI geliştirme)
* MediatR (CQRS ve loose coupling için)
* PostgreSQL (İlişkisel veritabanı)
* Neon (Veritabanı barınması için)
* Render (Projenin canlıya alınması için)
* FluentValidation (API istekleri sırasında doğrulama yapmak için)
* SignalR (Gerçek zamanlı iletişim için)
* JWT (Kullanıcıların kimliklerinin doğrulanması ve uygulama içerisinde yetkilendirme)


## Proje Yapısı

Projeyi, Clean Architecture prensiplerine uygun olarak katmanlı bir yapı ile geliştirdim
Katmanlar arası bağımlılık minimum seviyede tuttum ve iş mantığı ayrıştırdım

* **Application** (Uygulamanın iş mantığı / CQRS yapısı ile Handlerları burada yazdım)
* **Domain** (Uygulamanın sınıflarının bulunduğu katman)
* **Infrastructure** (Uygulamanın veritabanı bağlantısının ve işlemlerinin yapıldığı katman)
* **WebAPI** (Uygulamanın dışarıya açılan kısmı / HTTP isteklerinin karşılandığı katman)
  
