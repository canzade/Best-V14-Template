# 👑 En Kaliteli Discord.JS V14 Bot Altyapısı

Github'daki en iyi ve kaliteli Discord.JS v14 bot altyapısı! Hemen indirip kullanmaya başlayabilirsiniz!

# 📚 Özellikler

-   TypeScript sayesinde daha hızlı ve hatasız geliştirme ortamı. Korkmayın, JavaScript bilmeniz yeterli!
-   Yeni gelen slash komutlarına uygun şekilde tasarlanmış komut sistemi.
-   Dahili çoklu dil sistemi, hiçbir database verisi kaydetmeden Discord Interaction özelliği sayesinde her kullanıcıya özel dil desteği.
-   Tüm Interaction türlerine tam destek.
-   Direkt komutlarınızı yazabilmeniz için örnek komutlar.
-   Databse bağlantısı için örnek SQLite bağlantısı, Sequelize tarafından desteklenen tüm database sistemlerini kullanabilirsiniz.
-   Oluşturulan komutlar ve eventler için otomatik yönetim ve yükleme sistemi.
-   Dahili cooldown sistemi. Botları engellemek için belirtilen süreye göre rastgele cooldown süreleri.
-   Dahili shard sistemi. Botunuz büyümeye başlayınca shard sistemi ile uğraşmaya korkmayın!

# 📦 Kurulum

-   İlk olarak bilgisayarınızda [Node.JS](https://nodejs.org) kurulu olması gerekiyor.
-   Github'dan "Use Template" seçeneğine basarak bu altyapıyı kendi reponuza klonlayın.
-   `.env.example` dosyasını `.env` olarak değiştirin ve içindeki değerleri doldurun.
-   `npm install` komutu ile gerekli modülleri kurun.

## 🤖 Geliştirme

-   `npm run dev` komutu ile geliştirme aşamasında botu çalıştırın.
-   `npm run dev:watch` komutu ile geliştirme aşamasında anlık değişimlerle botu yeniden başlayacak şekilde çalıştırın.

## ⏰ Botu Çalıştırma

-   `npm run build` komutu ile botu derleyin.
-   `npm run start` komutu ile botu başlatın.

# ⭐ Projeyi Destekle

Bu altyapı tamamen ücretsiz olarak geliştirilmiş ve geliştirilmeye devam ediyor. Siz de bu projeye tamamen ücretsiz bir şekilde destek olmak isterseniz 4 seçeneğiniz var:

-   Bu projeyi yıldızlayarak destek olabilirsiniz.
-   Bu projeyi arkadaşlarınıza önererek destek olabilirsiniz.
-   Bulduğunuz hataları bildirerek destek olabilirsiniz.
-   Bir pull-request açarak direkt kodlara eklemede bulunabilirsiniz.

# 📝 Komut Taslağı

```ts
import { Logger } from "@hammerhq/logger";
import { SlashCommandBuilder } from "discord.js";
import { handleMultipleLocalization } from "../../struct/utils";
import { IHammerCommand } from "../../types";

const command: IHammerCommand = {
	logger: new Logger("[HammerCommandCommandName]:"),
	builder: new SlashCommandBuilder()
		.setName("komut_adı")
		.setDescription("komut açıklaması")
		// Buradan aşağısı dil desteği için gerekli.
		.setNameLocalizations(
			handleMultipleLocalization("command_names", "komut_adı"),
		)
		.setDescriptionLocalizations(
			handleMultipleLocalization(
				"command_names",
				"komut_adı_description",
			),
		),
	// Komutu bir kez daha kullanmadan önce kaç milisaniye beklemesi gerektiği. 10 saniye için 10 * 1000 yazın.
	cooldown: 1000 * 10,
	async execute({ interaction, hammer, silent }) {
		try {
			// Komutun kodları buraya.
			interaction.reply({
				content: hammer.i18n.get(
					interaction.locale,
					"commands",
					"ping",
					{
						ping: hammer.ws.ping.toString(),
					},
				),
				ephemeral: silent,
			});

			// Komutta bir sorun olmadıysa true döndürün. Eğer bir sorun varsa false döndürün.
			// Sorun olması durumunda false döndürürseniz komut yanıt olarak "bir hata oluştu"
			// mesajı gönderir.
			return true;
		} catch (error) {
			this.logger.error(error);

			return false;
		}
	},
};

export default command;
```
