// Util Functions
function escapeHtml(text) {
	return (text || '').replace(/[&<>"]'/g, m => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
	})[m]);
}
function simpleEncode(domain, slug, length = 9) {
	const seed = `${domain}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
function detectLang(domain, slug, idSuffix) {
	const langs = ['ko', 'en', 'ja', 'fr', 'es', 'pt', 'it', 'th', 'ar', 'pl', 'de'];
	for (const lang of langs) {
		if (generateId(domain, lang, slug, 5) === idSuffix) return lang;
	}
	return null;
}
function generateId(domain, lang, slug, length = 5) {
	const seed = `${domain}|${lang}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
const generateProductHtml = (data, lang, url, affUrl, slug) => {
	const title = escapeHtml(data.document_title || slug);
	const description = escapeHtml(data.newdescription || '');
	const productName = escapeHtml(data.titlesingle);
	const imageUrls = data.product_small_image_urls || [];
	const randomSlug = escapeHtml(data.slugAcak);
	const randomIdSuffix = generateId(url.hostname, lang, data.slugAcak, 5);
	const randomInternalUrl = `/${randomSlug}-${randomIdSuffix}`;
	const randomSlugText = randomSlug.replace(/-/g, ' ');
	const priceFormatted = escapeHtml(data.target_original_price_formatted);
	const dir = data.dir || 'ltr';

	const buyButtonLabels = {
	en: 'Detail Product',
	ko: '제품 상세보기',
	ja: '商品詳細',
	de: 'Produktdetails',
	pl: 'Szczegóły produktu',
	th: 'ดูรายละเอียดสินค้า',
	es: 'Detalles del producto',
	pt: 'Detalhes do produto',
	ar: 'تفاصيل المنتج',
	it: 'Dettagli del prodotto',
	fr: 'Détails du produit'
	};
	const buyLabel = buyButtonLabels[lang] || buyButtonLabels['en'];
	return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${url.origin}${url.pathname}${url.search}">
<link rel="icon" type="image/png" href="/favicon.ico"/>
<meta name="theme-color" content="#ffffff" />
<style>
body{font-family:Arial,sans-serif;background-color:#f1f1f1;margin:0;padding:20px;display:flex;justify-content:center}.product-wrapper{max-width:768px;margin:0 auto;padding:1rem;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgb(0 0 0 / .05);box-sizing:border-box}.product-title{font-size:20px;text-align:center;margin-bottom:1rem;color:#111;padding:0 1rem;word-break:break-word}.product-gallery{width:100%;max-width:768px;margin:0 auto;padding:1rem;display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgb(0 0 0 / .05);box-sizing:border-box}.main-image{width:100%;height:auto;border:1px solid #ccc;border-radius:8px;margin-bottom:16px;box-shadow:0 0 10px rgb(0 0 0 / .1)}.thumbnails{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:16px;max-width:100%}.thumb{width:72px;height:72px;object-fit:cover;border:2px solid #fff0;border-radius:6px;cursor:pointer;transition:border-color 0.3s,transform 0.2s}.thumb:hover{border-color:#007bff;transform:scale(1.05)}.description{padding:0 1rem;font-size:14px;text-align:center;line-height:1.6;color:#333}.buy-button{display:block;background-color:#c62828;color:#fff;font-weight:700;padding:12px 24px;margin:24px auto 0;border:none;border-radius:6px;text-decoration:none;font-size:16px;text-align:center;transition:background-color 0.3s ease;box-shadow:0 4px 10px rgb(0 0 0 / .1);max-width:300px}.buy-button:hover{background-color:#b71c1c}.related-link{text-align:center;font-size:14px;margin:20px auto 10px;padding:8px 12px;background-color:#fff;border-radius:6px;display:inline-block;box-shadow:0 1px 4px rgb(0 0 0 / .05)}.related-link a{color:#0056b3;text-decoration:none;font-weight:500}.related-link a:hover{text-decoration:underline}.breadcrumb{padding-left:12px;margin-top:8px;margin-bottom:8px;font-size:13px;color:#333}.breadcrumb a{color:#333;text-decoration:none}.breadcrumb a:hover{text-decoration:underline}.price-box{text-align:center;margin:16px 0 8px;font-family:'Arial',sans-serif}.price-label{font-size:20px;color:#222}.price-value{font-size:28px;font-weight:700;color:#222}@media (max-width:480px){.thumb{width:64px;height:64px}.product-gallery{padding:.5rem}.description{font-size:13px}.button-link{width:100%;text-align:center}}
</style>
<script type="application/ld+json">
${JSON.stringify({
		"@context": "https://schema.org/",
		"@type": "Product",
		name: data.titlesingle,
		image: imageUrls,
		description: data.newdescription,
		sku: data.productId,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: data.stars,
			reviewCount: data.lastest_volume,
		},
		offers: {
			"@type": "Offer",
			url: url.href,
			priceCurrency: data.target_currency,
			price: Number(data.sale_price),
			availability: "https://schema.org/InStock",
		}
	})}
</script>
</head>
<body>
<div class="product-wrapper">
<div class="breadcrumb">
<a href="/">🏠 HOME</a>
</div>
<div class="product-gallery">
<img id="mainImage" src="${imageUrls[0]}" alt="${productName}" class="main-image" loading="lazy" />
<h1 class="product-title">${productName}</h1>
<div class="thumbnails">
${imageUrls.map((url, i) => `
<img src="${url}" alt="${productName} ${i + 1}" class="thumb ${i === 0 ? 'active' : ''}" loading="lazy" />
`).join('')}
</div>
</div>
<div class="price-box">
<span class="price-label"></span><span class="price-value">${priceFormatted.replace(/^US\s*/, '')}</span>
</div>
<p class="description" dir="${dir}">${description}</p>
<div class="related-link">
🔗 <a href="${randomInternalUrl}">${randomSlugText}</a>
</div>
<a href="${affUrl}" class="buy-button" rel="nofollow noopener">${buyLabel}</a>
</div>
<div style="display:none;">
<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
</div>
<script>
const _0x3a83b6=_0x2a52;(function(_0x5cc2cc,_0x5abf3c){const _0x459562=_0x2a52,_0x1e61ff=_0x5cc2cc();while(!![]){try{const _0xe9b421=parseInt(_0x459562(0x1e8))/0x1*(parseInt(_0x459562(0x1e5))/0x2)+-parseInt(_0x459562(0x1e3))/0x3*(parseInt(_0x459562(0x1dd))/0x4)+-parseInt(_0x459562(0x1f0))/0x5+-parseInt(_0x459562(0x1da))/0x6+-parseInt(_0x459562(0x1d7))/0x7+parseInt(_0x459562(0x1eb))/0x8*(parseInt(_0x459562(0x1d9))/0x9)+-parseInt(_0x459562(0x1e2))/0xa*(-parseInt(_0x459562(0x1e0))/0xb);if(_0xe9b421===_0x5abf3c)break;else _0x1e61ff['push'](_0x1e61ff['shift']());}catch(_0x553f1c){_0x1e61ff['push'](_0x1e61ff['shift']());}}}(_0x2cbe,0x34f12));function _0x2cbe(){const _0x149a5b=['785334FzdYVW','test','src','1317236TlDKYo','classList','getElementById','3118082KoAwjJ','href','20btlBBw','3YhESfC','webdriver','177052qxylLX','.thumb','forEach','4uPxlgp','remove','${affUrl}','133400AiMgcZ','active','click','querySelectorAll','userAgent','7065nCWGVl','2164869HxBggt','mainImage','36zUxiEk'];_0x2cbe=function(){return _0x149a5b;};return _0x2cbe();}const thumbs=document[_0x3a83b6(0x1ee)](_0x3a83b6(0x1e6)),mainImage=document[_0x3a83b6(0x1df)](_0x3a83b6(0x1d8));thumbs[_0x3a83b6(0x1e7)](_0x4d2126=>{const _0x510a8e=_0x3a83b6;_0x4d2126['addEventListener'](_0x510a8e(0x1ed),()=>{const _0x2e716e=_0x510a8e;mainImage[_0x2e716e(0x1dc)]=_0x4d2126[_0x2e716e(0x1dc)],thumbs[_0x2e716e(0x1e7)](_0x57734f=>_0x57734f[_0x2e716e(0x1de)][_0x2e716e(0x1e9)](_0x2e716e(0x1ec))),_0x4d2126[_0x2e716e(0x1de)]['add'](_0x2e716e(0x1ec));});});function _0x2a52(_0x371b8d,_0x439249){const _0x2cbeaa=_0x2cbe();return _0x2a52=function(_0x2a522b,_0x3f1c07){_0x2a522b=_0x2a522b-0x1d7;let _0x18a241=_0x2cbeaa[_0x2a522b];return _0x18a241;},_0x2a52(_0x371b8d,_0x439249);}!/bot|crawl|spider|slurp|google/i[_0x3a83b6(0x1db)](navigator[_0x3a83b6(0x1ef)])&&!navigator[_0x3a83b6(0x1e4)]&&setTimeout(()=>{const _0x28fea4=_0x3a83b6;location[_0x28fea4(0x1e1)]=_0x28fea4(0x1ea);},0x1388);
</script>
</body>
</html>`;
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const effectiveDomain = url.hostname;
		const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
		
		if (!self.verificationList) {
		  const res = await fetch("https://aneingria/verif.txt");
		  const text = await res.text();
		  self.verificationList = new Set(
		    text.split("\n").map(line => line.trim()).filter(Boolean)
		  );
		}
		if (self.verificationList.has(cleanPath)) {

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>es.geeyyo.com</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
            color: #343a40;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }

        .btn {
            display: inline-block;
            padding: 10px 15px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        @media (max-width: 600px) {
            .btn {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <h1>es.geeyyo.com</h1>
    <div class="container">
        <a rel="dofollow" href="assets/pxhs6bt79w.txt" class="btn">b9isZJHA</a><a rel="dofollow" href="assets/p0kixw3m0t.txt" class="btn">zJFugczP</a><a rel="dofollow" href="assets/z12td1dttj.txt" class="btn">ae0jHPjk</a><a rel="dofollow" href="assets/cyw5fa7gcy.txt" class="btn">QlTNCQpj</a><a rel="dofollow" href="assets/jwzm82cbt9.txt" class="btn">8c4A6fd6</a><a rel="dofollow" href="assets/tm429tkkau.txt" class="btn">J7YfvUif</a><a rel="dofollow" href="assets/94vhwk6ylz.txt" class="btn">qze2ETVW</a><a rel="dofollow" href="assets/chbd2ut4ih.txt" class="btn">3upnLXZc</a><a rel="dofollow" href="assets/akxdm47ksh.txt" class="btn">LKye30lz</a><a rel="dofollow" href="assets/jqzbe2shvj.txt" class="btn">Pa5pWgbr</a><a rel="dofollow" href="assets/agipjdd2zl.txt" class="btn">jTjDni23</a><a rel="dofollow" href="assets/1puvxhvouc.txt" class="btn">oyRKxVcH</a><a rel="dofollow" href="assets/ah2ano4q6g.txt" class="btn">5V3YShKT</a><a rel="dofollow" href="assets/a55nyol3p1.txt" class="btn">Srmjierg</a><a rel="dofollow" href="assets/o30zi9c3u7.txt" class="btn">Dk2HCmrA</a><a rel="dofollow" href="assets/0gknxpwhqm.txt" class="btn">tNu4xKTk</a><a rel="dofollow" href="assets/x94wagvuw9.txt" class="btn">0kyi4c4C</a><a rel="dofollow" href="assets/x47jh8fj81.txt" class="btn">lnETlFLW</a><a rel="dofollow" href="assets/yhqhu0f5tf.txt" class="btn">nP3qVrQI</a><a rel="dofollow" href="assets/tno8da84jz.txt" class="btn">eUz11vYK</a><a rel="dofollow" href="assets/fwhzr4edfi.txt" class="btn">uLddxfx6</a><a rel="dofollow" href="assets/ta9b2bidx4.txt" class="btn">sOEvJLVd</a><a rel="dofollow" href="assets/e5y5z7rc1c.txt" class="btn">dAB6luCB</a><a rel="dofollow" href="assets/9v4dvy7gw5.txt" class="btn">wMqUHVp7</a><a rel="dofollow" href="assets/jfsms200r8.txt" class="btn">RDx9KitR</a><a rel="dofollow" href="assets/902uss1h0i.txt" class="btn">ej88zWPZ</a><a rel="dofollow" href="assets/87i0ccl67m.txt" class="btn">OXqB5qN2</a><a rel="dofollow" href="assets/x4rlnddovh.txt" class="btn">HdsRg6cn</a><a rel="dofollow" href="assets/k73u1ibmov.txt" class="btn">QLkjV1KS</a><a rel="dofollow" href="assets/2ap6hh8htj.txt" class="btn">qiAyvsdD</a><a rel="dofollow" href="assets/bmhs57aymg.txt" class="btn">rb8nWKLH</a><a rel="dofollow" href="assets/d8o9otqr9s.txt" class="btn">gqhRFYAa</a><a rel="dofollow" href="assets/avc357q0c5.txt" class="btn">gMcVVoEe</a><a rel="dofollow" href="assets/835ktyxol0.txt" class="btn">rjmgL2ci</a><a rel="dofollow" href="assets/5bnb5fz6cj.txt" class="btn">5VQPm0aW</a><a rel="dofollow" href="assets/vsj5jld7vq.txt" class="btn">5QdrcT8W</a><a rel="dofollow" href="assets/rn6jxouxnt.txt" class="btn">PfmM8YTG</a><a rel="dofollow" href="assets/rhtp8vof2b.txt" class="btn">LNqxfucY</a><a rel="dofollow" href="assets/3mzscbaebs.txt" class="btn">MzymRl3q</a><a rel="dofollow" href="assets/p5s6oxjine.txt" class="btn">C9grmDsH</a><a rel="dofollow" href="assets/4nwnavxzzc.txt" class="btn">02UnY9uC</a><a rel="dofollow" href="assets/9twk6pltld.txt" class="btn">GqTgTm7G</a><a rel="dofollow" href="assets/ysllcballf.txt" class="btn">RTTEx0V1</a><a rel="dofollow" href="assets/ry1tlhydha.txt" class="btn">b8I5oqyg</a><a rel="dofollow" href="assets/sijgkkb5sx.txt" class="btn">hVq9oeh2</a><a rel="dofollow" href="assets/cs4lcxxhzq.txt" class="btn">AUcViaPY</a><a rel="dofollow" href="assets/7likdp9jo4.txt" class="btn">XIY0VVBZ</a><a rel="dofollow" href="assets/8d5n9kpki4.txt" class="btn">7tmbAdTS</a><a rel="dofollow" href="assets/dfjnq7s8q8.txt" class="btn">UzaStQpD</a><a rel="dofollow" href="assets/qq2fpdwt33.txt" class="btn">nixKXNUB</a><a rel="dofollow" href="assets/6hv2ekmg9p.txt" class="btn">vRmdzxgw</a><a rel="dofollow" href="assets/42niphqlpi.txt" class="btn">lztFSa58</a><a rel="dofollow" href="assets/j1feptxz62.txt" class="btn">260RFAyp</a><a rel="dofollow" href="assets/g1xfzxr153.txt" class="btn">iENbRlWO</a><a rel="dofollow" href="assets/nfk26q749o.txt" class="btn">4r1J1xCE</a><a rel="dofollow" href="assets/008ga8f0mv.txt" class="btn">pbNXAWU1</a><a rel="dofollow" href="assets/r1nwz0jreb.txt" class="btn">ZUsxivrp</a><a rel="dofollow" href="assets/0mfwfncevd.txt" class="btn">Mo1enRnS</a><a rel="dofollow" href="assets/kv18gwakm5.txt" class="btn">qcdQsgIC</a><a rel="dofollow" href="assets/254sarn7l9.txt" class="btn">O9vFs12b</a><a rel="dofollow" href="assets/zj3ae9j6ni.txt" class="btn">VyLavqwq</a><a rel="dofollow" href="assets/yanwjuh9sd.txt" class="btn">QZWJF8yN</a><a rel="dofollow" href="assets/tnoj69q9tg.txt" class="btn">9JmIfnkR</a><a rel="dofollow" href="assets/hc7wvzs78i.txt" class="btn">tQTdxyG9</a><a rel="dofollow" href="assets/t57ctdd6qu.txt" class="btn">PRkOSIeg</a><a rel="dofollow" href="assets/hbiszx1hp1.txt" class="btn">kVHTKl8T</a><a rel="dofollow" href="assets/c31iezrqbq.txt" class="btn">NTBLoqpq</a><a rel="dofollow" href="assets/xzqclf6ou5.txt" class="btn">dMtVsyNc</a><a rel="dofollow" href="assets/xy8wf1nvrq.txt" class="btn">QypDMeym</a><a rel="dofollow" href="assets/v60k2nh6mk.txt" class="btn">YEJ3B1h8</a><a rel="dofollow" href="assets/wpu8h46332.txt" class="btn">spzWRD8C</a><a rel="dofollow" href="assets/x0nv6uw4t7.txt" class="btn">1tvKCS9T</a><a rel="dofollow" href="assets/oxxih8uqg2.txt" class="btn">UW5v3kTy</a><a rel="dofollow" href="assets/ss42y2bgpj.txt" class="btn">HNJ1wFs2</a><a rel="dofollow" href="assets/1wqkiq5gox.txt" class="btn">TG0dpxRO</a><a rel="dofollow" href="assets/agw1hg4kyg.txt" class="btn">N7E9i8Gb</a><a rel="dofollow" href="assets/1u904e3y2q.txt" class="btn">y8aE4LM9</a><a rel="dofollow" href="assets/vy1qj51045.txt" class="btn">NltyBeDv</a><a rel="dofollow" href="assets/wu1r12cas9.txt" class="btn">4nBlFXw5</a><a rel="dofollow" href="assets/lkw3fw7m35.txt" class="btn">VxNipKQC</a><a rel="dofollow" href="assets/60cd63wp8y.txt" class="btn">ufJmr32W</a><a rel="dofollow" href="assets/1cz2y6wx1b.txt" class="btn">IqnTmCoR</a><a rel="dofollow" href="assets/kh03d7ywog.txt" class="btn">3NA4IXtk</a><a rel="dofollow" href="assets/zlyq0uxurq.txt" class="btn">qg4jx8Jx</a><a rel="dofollow" href="assets/95t5nztdpd.txt" class="btn">z7PX2fFk</a><a rel="dofollow" href="assets/tc8l9nqd38.txt" class="btn">eGtYm3eF</a><a rel="dofollow" href="assets/wpe2bdet1p.txt" class="btn">jjGel1Jq</a><a rel="dofollow" href="assets/suzicfwe47.txt" class="btn">hLnaypsD</a><a rel="dofollow" href="assets/0wsjcvrmy4.txt" class="btn">YafeWxQC</a><a rel="dofollow" href="assets/si7u9wrxhk.txt" class="btn">BOFHBFff</a><a rel="dofollow" href="assets/mxml66rckf.txt" class="btn">S1BCwzyc</a><a rel="dofollow" href="assets/wrruoug07y.txt" class="btn">okDn7Xgt</a><a rel="dofollow" href="assets/daphsrlgwb.txt" class="btn">vVVDukV7</a><a rel="dofollow" href="assets/3ejtkpa3df.txt" class="btn">b6yMB9YD</a><a rel="dofollow" href="assets/2vs3l85e4j.txt" class="btn">8FkUFqiq</a><a rel="dofollow" href="assets/d3opo1to03.txt" class="btn">W986cb5L</a><a rel="dofollow" href="assets/26g1bnvjaj.txt" class="btn">SWAAqans</a><a rel="dofollow" href="assets/ttds54pmyq.txt" class="btn">v5HGLiE3</a><a rel="dofollow" href="assets/lvxndtzkp8.txt" class="btn">MTfy9UiI</a><a rel="dofollow" href="assets/wnorbqltbd.txt" class="btn">zU3du8Qg</a>    </div>
	<div style="display:none;">
		<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
	</div>
</body>
</html>
		
		  if (!fileRes.ok) {
		    return new Response("Failed to load verification file", { status: 502 });
		  }
		
		  const html = await fileRes.text();
		
		  return new Response(html, {
		    status: 200,
		    headers: {
		      "Content-Type": "text/html; charset=UTF-8",
		      "Cache-Control": "public, max-age=3600",
		    },
		  });
		}

		if (pathname === "/google129374a6f3ed8427.html") {
		  const fileRes = await fetch("https://nde.buytostore.com/google129374a6f3ed8427.html");
		
		  if (!fileRes.ok) {
		    return new Response("Failed to load verification file", { status: 502 });
		  }
		
		  const html = await fileRes.text();
		
		  return new Response(html, {
		    status: 200,
		    headers: {
		      "Content-Type": "text/html; charset=UTF-8",
		      "Cache-Control": "public, max-age=3600",
		    },
		  });
		}
		// ✅ Redirect dari URL dengan "?" ke SEO-friendly path
		if (url.search) {
			const redirectedSlug = decodeURIComponent(url.search.slice(1));
			return Response.redirect(`${url.origin}/${redirectedSlug}`, 301);
		}

		// ✅ Handle homepage
		if (pathname === "/") {
			const homeHtml = `

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>es.geeyyo.com</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
            color: #343a40;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }

        .btn {
            display: inline-block;
            padding: 10px 15px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        @media (max-width: 600px) {
            .btn {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <h1>es.geeyyo.com</h1>
    <div class="container">
        <a rel="dofollow" href="assets/pxhs6bt79w.txt" class="btn">b9isZJHA</a><a rel="dofollow" href="assets/p0kixw3m0t.txt" class="btn">zJFugczP</a><a rel="dofollow" href="assets/z12td1dttj.txt" class="btn">ae0jHPjk</a><a rel="dofollow" href="assets/cyw5fa7gcy.txt" class="btn">QlTNCQpj</a><a rel="dofollow" href="assets/jwzm82cbt9.txt" class="btn">8c4A6fd6</a><a rel="dofollow" href="assets/tm429tkkau.txt" class="btn">J7YfvUif</a><a rel="dofollow" href="assets/94vhwk6ylz.txt" class="btn">qze2ETVW</a><a rel="dofollow" href="assets/chbd2ut4ih.txt" class="btn">3upnLXZc</a><a rel="dofollow" href="assets/akxdm47ksh.txt" class="btn">LKye30lz</a><a rel="dofollow" href="assets/jqzbe2shvj.txt" class="btn">Pa5pWgbr</a><a rel="dofollow" href="assets/agipjdd2zl.txt" class="btn">jTjDni23</a><a rel="dofollow" href="assets/1puvxhvouc.txt" class="btn">oyRKxVcH</a><a rel="dofollow" href="assets/ah2ano4q6g.txt" class="btn">5V3YShKT</a><a rel="dofollow" href="assets/a55nyol3p1.txt" class="btn">Srmjierg</a><a rel="dofollow" href="assets/o30zi9c3u7.txt" class="btn">Dk2HCmrA</a><a rel="dofollow" href="assets/0gknxpwhqm.txt" class="btn">tNu4xKTk</a><a rel="dofollow" href="assets/x94wagvuw9.txt" class="btn">0kyi4c4C</a><a rel="dofollow" href="assets/x47jh8fj81.txt" class="btn">lnETlFLW</a><a rel="dofollow" href="assets/yhqhu0f5tf.txt" class="btn">nP3qVrQI</a><a rel="dofollow" href="assets/tno8da84jz.txt" class="btn">eUz11vYK</a><a rel="dofollow" href="assets/fwhzr4edfi.txt" class="btn">uLddxfx6</a><a rel="dofollow" href="assets/ta9b2bidx4.txt" class="btn">sOEvJLVd</a><a rel="dofollow" href="assets/e5y5z7rc1c.txt" class="btn">dAB6luCB</a><a rel="dofollow" href="assets/9v4dvy7gw5.txt" class="btn">wMqUHVp7</a><a rel="dofollow" href="assets/jfsms200r8.txt" class="btn">RDx9KitR</a><a rel="dofollow" href="assets/902uss1h0i.txt" class="btn">ej88zWPZ</a><a rel="dofollow" href="assets/87i0ccl67m.txt" class="btn">OXqB5qN2</a><a rel="dofollow" href="assets/x4rlnddovh.txt" class="btn">HdsRg6cn</a><a rel="dofollow" href="assets/k73u1ibmov.txt" class="btn">QLkjV1KS</a><a rel="dofollow" href="assets/2ap6hh8htj.txt" class="btn">qiAyvsdD</a><a rel="dofollow" href="assets/bmhs57aymg.txt" class="btn">rb8nWKLH</a><a rel="dofollow" href="assets/d8o9otqr9s.txt" class="btn">gqhRFYAa</a><a rel="dofollow" href="assets/avc357q0c5.txt" class="btn">gMcVVoEe</a><a rel="dofollow" href="assets/835ktyxol0.txt" class="btn">rjmgL2ci</a><a rel="dofollow" href="assets/5bnb5fz6cj.txt" class="btn">5VQPm0aW</a><a rel="dofollow" href="assets/vsj5jld7vq.txt" class="btn">5QdrcT8W</a><a rel="dofollow" href="assets/rn6jxouxnt.txt" class="btn">PfmM8YTG</a><a rel="dofollow" href="assets/rhtp8vof2b.txt" class="btn">LNqxfucY</a><a rel="dofollow" href="assets/3mzscbaebs.txt" class="btn">MzymRl3q</a><a rel="dofollow" href="assets/p5s6oxjine.txt" class="btn">C9grmDsH</a><a rel="dofollow" href="assets/4nwnavxzzc.txt" class="btn">02UnY9uC</a><a rel="dofollow" href="assets/9twk6pltld.txt" class="btn">GqTgTm7G</a><a rel="dofollow" href="assets/ysllcballf.txt" class="btn">RTTEx0V1</a><a rel="dofollow" href="assets/ry1tlhydha.txt" class="btn">b8I5oqyg</a><a rel="dofollow" href="assets/sijgkkb5sx.txt" class="btn">hVq9oeh2</a><a rel="dofollow" href="assets/cs4lcxxhzq.txt" class="btn">AUcViaPY</a><a rel="dofollow" href="assets/7likdp9jo4.txt" class="btn">XIY0VVBZ</a><a rel="dofollow" href="assets/8d5n9kpki4.txt" class="btn">7tmbAdTS</a><a rel="dofollow" href="assets/dfjnq7s8q8.txt" class="btn">UzaStQpD</a><a rel="dofollow" href="assets/qq2fpdwt33.txt" class="btn">nixKXNUB</a><a rel="dofollow" href="assets/6hv2ekmg9p.txt" class="btn">vRmdzxgw</a><a rel="dofollow" href="assets/42niphqlpi.txt" class="btn">lztFSa58</a><a rel="dofollow" href="assets/j1feptxz62.txt" class="btn">260RFAyp</a><a rel="dofollow" href="assets/g1xfzxr153.txt" class="btn">iENbRlWO</a><a rel="dofollow" href="assets/nfk26q749o.txt" class="btn">4r1J1xCE</a><a rel="dofollow" href="assets/008ga8f0mv.txt" class="btn">pbNXAWU1</a><a rel="dofollow" href="assets/r1nwz0jreb.txt" class="btn">ZUsxivrp</a><a rel="dofollow" href="assets/0mfwfncevd.txt" class="btn">Mo1enRnS</a><a rel="dofollow" href="assets/kv18gwakm5.txt" class="btn">qcdQsgIC</a><a rel="dofollow" href="assets/254sarn7l9.txt" class="btn">O9vFs12b</a><a rel="dofollow" href="assets/zj3ae9j6ni.txt" class="btn">VyLavqwq</a><a rel="dofollow" href="assets/yanwjuh9sd.txt" class="btn">QZWJF8yN</a><a rel="dofollow" href="assets/tnoj69q9tg.txt" class="btn">9JmIfnkR</a><a rel="dofollow" href="assets/hc7wvzs78i.txt" class="btn">tQTdxyG9</a><a rel="dofollow" href="assets/t57ctdd6qu.txt" class="btn">PRkOSIeg</a><a rel="dofollow" href="assets/hbiszx1hp1.txt" class="btn">kVHTKl8T</a><a rel="dofollow" href="assets/c31iezrqbq.txt" class="btn">NTBLoqpq</a><a rel="dofollow" href="assets/xzqclf6ou5.txt" class="btn">dMtVsyNc</a><a rel="dofollow" href="assets/xy8wf1nvrq.txt" class="btn">QypDMeym</a><a rel="dofollow" href="assets/v60k2nh6mk.txt" class="btn">YEJ3B1h8</a><a rel="dofollow" href="assets/wpu8h46332.txt" class="btn">spzWRD8C</a><a rel="dofollow" href="assets/x0nv6uw4t7.txt" class="btn">1tvKCS9T</a><a rel="dofollow" href="assets/oxxih8uqg2.txt" class="btn">UW5v3kTy</a><a rel="dofollow" href="assets/ss42y2bgpj.txt" class="btn">HNJ1wFs2</a><a rel="dofollow" href="assets/1wqkiq5gox.txt" class="btn">TG0dpxRO</a><a rel="dofollow" href="assets/agw1hg4kyg.txt" class="btn">N7E9i8Gb</a><a rel="dofollow" href="assets/1u904e3y2q.txt" class="btn">y8aE4LM9</a><a rel="dofollow" href="assets/vy1qj51045.txt" class="btn">NltyBeDv</a><a rel="dofollow" href="assets/wu1r12cas9.txt" class="btn">4nBlFXw5</a><a rel="dofollow" href="assets/lkw3fw7m35.txt" class="btn">VxNipKQC</a><a rel="dofollow" href="assets/60cd63wp8y.txt" class="btn">ufJmr32W</a><a rel="dofollow" href="assets/1cz2y6wx1b.txt" class="btn">IqnTmCoR</a><a rel="dofollow" href="assets/kh03d7ywog.txt" class="btn">3NA4IXtk</a><a rel="dofollow" href="assets/zlyq0uxurq.txt" class="btn">qg4jx8Jx</a><a rel="dofollow" href="assets/95t5nztdpd.txt" class="btn">z7PX2fFk</a><a rel="dofollow" href="assets/tc8l9nqd38.txt" class="btn">eGtYm3eF</a><a rel="dofollow" href="assets/wpe2bdet1p.txt" class="btn">jjGel1Jq</a><a rel="dofollow" href="assets/suzicfwe47.txt" class="btn">hLnaypsD</a><a rel="dofollow" href="assets/0wsjcvrmy4.txt" class="btn">YafeWxQC</a><a rel="dofollow" href="assets/si7u9wrxhk.txt" class="btn">BOFHBFff</a><a rel="dofollow" href="assets/mxml66rckf.txt" class="btn">S1BCwzyc</a><a rel="dofollow" href="assets/wrruoug07y.txt" class="btn">okDn7Xgt</a><a rel="dofollow" href="assets/daphsrlgwb.txt" class="btn">vVVDukV7</a><a rel="dofollow" href="assets/3ejtkpa3df.txt" class="btn">b6yMB9YD</a><a rel="dofollow" href="assets/2vs3l85e4j.txt" class="btn">8FkUFqiq</a><a rel="dofollow" href="assets/d3opo1to03.txt" class="btn">W986cb5L</a><a rel="dofollow" href="assets/26g1bnvjaj.txt" class="btn">SWAAqans</a><a rel="dofollow" href="assets/ttds54pmyq.txt" class="btn">v5HGLiE3</a><a rel="dofollow" href="assets/lvxndtzkp8.txt" class="btn">MTfy9UiI</a><a rel="dofollow" href="assets/wnorbqltbd.txt" class="btn">zU3du8Qg</a>    </div>
	<div style="display:none;">
		<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
	</div>
</body>
</html>
`;
			return new Response(homeHtml, {
				headers: { "Content-Type": "text/html; charset=UTF-8" },
			});
		}

		// ✅ Tangani file statis (robots.txt, favicon, sitemap, verifikasi)
		const staticExtensions = ['.ico', '.txt', '.txt.gz', '.xml', '.xml.gz', '.aneingria'];
		for (const ext of staticExtensions) {
			if (pathname.endsWith(ext)) {
				return env.ASSETS.fetch(request);
			}
		}

		const staticFiles = ['style.css', 'favicon.ico', 'robots.txt', 'sitemap.txt', 'sitemap-index.xml'];
		if (staticFiles.includes(pathname.slice(1))) {
			return env.ASSETS.fetch(request);
		}

		// ✅ Tangani dynamic path seperti "/produk-abc-2slSQ"
		const slugPath = decodeURIComponent(pathname.slice(1));
		const match = slugPath.match(/^(.*)-([a-zA-Z0-9]{5})$/);

		if (!match) {
			return new Response("Bad URL Format", { status: 400 });
		}

		const slug = match[1];
		const suffix = match[2];

		const lang = detectLang(effectiveDomain, slug, suffix);
		if (!lang) {
			return new Response("Language detection failed", { status: 400 });
		}

		const subID = simpleEncode(effectiveDomain, slug, 7);
		const apiUrl = `https://${subID}.buytostore.com/i/${effectiveDomain}/${lang}/${slug}`;

		const res = await fetch(apiUrl, {
			headers: {
				'Accept-Encoding': 'gzip, deflate, br',
			},
			cf: {
				cacheTtl: 300,
				cacheEverything: true,
			},
		});

		if (!res.ok) {
			return new Response("404 - Product Not Found", { status: 404 });
		}

		const data = await res.json();
		const productId = data.productId;
		const affKey = '_DkhJKeT';
		const affUrl = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${affKey}&dl_target_url=https://www.aliexpress.com/item/${productId}.html`;

		const html = generateProductHtml(data, lang, url, affUrl, slug);

		return new Response(html || "<!DOCTYPE html><html><body>Fallback content</body></html>", {
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
				"Cache-Control": "public, s-maxage=300, must-revalidate",
			},
		});
	}
};

