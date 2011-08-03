# GooglePlusPlus User Mute

## General Information
The `googleplusplus_user_mute` userscript / extension for Google+ (aka Google Plus aka G+) mutes all posts by specific users. Click _MUTE USER_ link next to the Public/Limited status. Once muted, a placeholder for each post appears with _{User Name} UNMUTE_, which if clicked will stop muting that particular user.

Shared posts where the originator is muted also get muted and in the placeholder appears: (MUTED SHARE – SEE ORIGINAL POSTER TO UNMUTE). Clicking _SEE ORIGINAL POSTER TO UNMUTE_ takes you to the originator's profile where you can UNMUTE them.

>**Install**: <http://go.wittman.org/azpz>

>_Discussion_: <https://plus.google.com/111309687695898923996/posts/BjipDXXgf77>

So far, this userscript / extension was tested on Google Chrome 12 and Firefox 5 with [Greasemonkey](http://www.greasespot.net/) ([download](https://addons.mozilla.org/firefox/748/)) and should also work in Safari with the plugin [NinjaKit](http://d.hatena.ne.jp/os0x/20100612/1276330696) ([download](http://ss-o.net/safari/extension/NinjaKit.safariextz)).

##Language Translations

A user's language of choice can be detected from the browser's language setting. If a translation is defined in the extension, the extension interface elements (e.g. button labels) will be translated accordingly. The default/fallback language is English (US, but there are no English-dialect-specific words so far).

Translations from the Google+ community are most welcome—crowd-sourcing!. I will do the best I can to add languages as they roll in, and publish extension version updates in a reasonable timeframe.

Please post comments publicly on the User Mute translation thread [googleplusplus_user_mute discussion thread](https://plus.google.com/111309687695898923996/posts/jdyRNnUZh3a). There's a [link](http://go.wittman.org/g592) there an introduction to using a collaborative Google spreadsheet to record the translations.

For reference, below is the Javascript object literal that will hold all the defined translations.

```javascript
{
	'unmute' : {
		'en-US' : 'UNMUTE',
		'xx-XX' : '_____'
	},
	'muted_share' : {
		'en-US' : 'MUTED SHARE',
		'xx-XX' : '_____'
	},
	'see_original' : {
		'en-US' : 'SEE ORIGINAL POSTER TO UNMUTE',
		'xx-XX' : '_____'
	},
	'mute_user' : {
		'en-US' : 'MUTE USER',
		'xx-XX' : '_____'
	}
}
```

## Change Log

### Version 0.1.6

- Immediate correction to previous version. FIX

### Version 0.1.5

- Changes made today by Google introduced breaking DOM tree changes. All modules needed updating and are now fixed. FIX

### Version 0.1.4

- Recent change by Google required an adjustment to detect the user's name and the post ID. User Mute now fully functional again. FIX

### Version 0.1.3

- Language New language added: sv-SE (Swedish) courtesy of Kim Nilsson https://plus.google.com/109325348412536933420/posts - thank you! NEW

### Version 0.1.2

- Interface text typo corrected. FIX

### Version 0.1.1

- Extension is functionally, language independent, and translation-ready for interface elements. Only the default language English (en-US) is defined so far. NEW

### Version 0.1.0

- Initial Release