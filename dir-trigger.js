(function() {
  var DA_FRAGMENTS = {
    'directory-search': 'fragment-directory-search.alex-rollin.workers.dev',
    'directory-select': 'fragment-directory-select.alex-rollin.workers.dev',
    'directory-enrich': 'fragment-directory-enrich.alex-rollin.workers.dev',
    'directory-import': 'fragment-directory-import.alex-rollin.workers.dev',
    'directory-summary': 'fragment-directory-summary.alex-rollin.workers.dev',
    'directory-credits': 'fragment-directory-credits.alex-rollin.workers.dev',
  };

  var DIR_KEYWORDS = [
    'zoek bedrijven', 'search businesses', 'find businesses',
    'kapper', 'restaurant', 'cafe', 'bakkerij', 'bakery',
    'verrijk', 'enrich', 'import', 'importeer',
    'directory agent', 'plaatsen zoeken', 'places search',
    'gmaps data', 'contact gegevens', 'contact details',
    'credits', 'tegoed', 'bedrijven in',
  ];

  window.BbDirectoryTrigger = {
    detect: function(userMessage) {
      var lower = userMessage.toLowerCase();
      var matched = [];

      if (/zoek|search|find|vind|bedrijven|businesses|plaatsen|places/i.test(lower)) {
        matched.push('directory-search', 'directory-select');
      }
      if (/verrijk|enrich|contact|gmaps|gegevens|details/i.test(lower)) {
        matched.push('directory-enrich');
      }
      if (/import|importeer|wordpress|wp|site/i.test(lower)) {
        matched.push('directory-import');
      }
      if (/credits|tegoed|balance/i.test(lower)) {
        matched.push('directory-credits');
      }
      if (/samenvatting|summary|overzicht|overview|export/i.test(lower)) {
        matched.push('directory-summary');
      }

      if (matched.length === 0 && DIR_KEYWORDS.some(function(k) { return lower.includes(k); })) {
        matched.push('directory-search');
      }

      var unique = matched.filter(function(v, i, a) { return a.indexOf(v) === i; });
      return { match: unique.length > 0, fragments: unique, confidence: unique.length > 0 ? 0.8 : 0 };
    },

    buildSrc: function(fragmentName, orgId, lang) {
      var host = DA_FRAGMENTS[fragmentName];
      if (!host) return '';
      return 'https://' + host + '/?' + new URLSearchParams({ org: orgId || '', lang: lang || 'nl' }).toString();
    },

    embed: function(fragmentName, orgId, lang) {
      var src = this.buildSrc(fragmentName, orgId, lang);
      if (!src) return '';
      return '<iframe src="' + src + '" style="width:100%;height:400px;border:none;border-radius:12px;" loading="lazy" allow="clipboard-write"></iframe>';
    }
  };
})();
