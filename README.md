sc55mk2-ctf-patcher
===================


What is this?
-------------

This tool modifies the firmware of SC-55mkII (or related models) to support "Alternate Voicings" (also known as Capital Tone Fallback (CTF)).


What is Alternate Voicings? (a.k.a. CTF)
----------------------------------------

"Alternate Voicings" is a feature that was supported by the early GS sound modules, the SC-55 and its compatibles. This function substitutes a similar tone when a non-existent variation tone is selected. For more information, please refer to the following manuals:

* [CM-300 Owner's Manual](https://web.archive.org/web/20140826121448/http://media.rolandus.com/manuals/CM-300_OM.pdf)
	* 4. About The GS Format
		* (4) Alternate Voicings - No Matter What GS Sound Source You Use, The Song Remains The Same
		* (5) General Use Areas and Special Use Areas
* [CM-300 取扱説明書](http://lib.roland.co.jp/support/jp/manuals/res/62265292/CM-300_j.pdf)
	* 4. GSフォーマットについて
		* (4) 代理発音――どのGS音源でも同じような音色で演奏させるための工夫
		* (5) 汎用エリアと専用エリア

But, this feature was omitted in the SC-55mkII, the successor to the SC-55. According to one theory, it infringed on Yamaha's patent and had to be removed. This feature was never restored in the many GS-compatible devices released thereafter.

As a matter of fact, this feature had caused a situation in which composers could mistakenly specify a non-existent variation tone but not notice it because a capital tone would be selected automatically. These mistakes were discovered in the form of "incorrectly specified tones not being played" in the SC-55mkII and later sound modules. The disruption of music performance caused by this affected mainly PC games that use MIDI sound modules for background music.


How to Use
----------

1. Dump firmware ROM as a binary file from your SC-55mkII.
2. Apply this tool to the binary file.
3. Program the modified firmware binary to any writable ROM compatible with the original firmware ROM.
4. Replace the original firmware ROM to the newly programmed ROM.


Supported Models
----------------

Note: I have not yet tried the tool on actual devices if it really works as intended.

* SC-55mkII
* SC-33
* XP-10
* PMA-5

It can also be applied to the firmware of the original SC-55 and its compatible models. However, it does not make much sense.


How it works
------------

The SC-55 series firmware ROM has a table of 2 bytes x 128 programs x 128 variations in the range of 0x030000-0x038000. Each value in the table indicates the serial number of the tone, and if there is no tone corresponding to the program number and variation number, 0xffff is stored. This tool rewrites the value of 0xffff in the table to the appropriate tone number to support the Alternate Voicings feature.

As described in the aforementioned manual, the area of the tables to be rewritten is as follows:

* Program No. 1 to 120 are processed.
	* No. 121 to 128 are not included because they are sound effects.
* Bank select No. 0 to 63 are processed.
	* No. 64 to 127 are not included because they are special use area.

Although not explicitly mentioned in the manual, the Alternate Voicings feature also applies to drum sets. However, the ranges of program numbers are different depending on the firmware version as follows:

* v1.21 or earlier: Program No. 1 to 64
* v2.00: Program No. 1 to 48

As for drum sets, the firmware ROM also has a table of 1 byte x 128 programs in the range of 0x038000-0x038080. Similar to the tone tables, if there is no drum set corresponding to the program number, 0xff is stored. By default, this tool rewrites the table according to the behavior of firmware v1.21.


Compatibility options (Tone)
----------------------------

### Strict SC-55 (Not recommended)

Even when a variation tone added in the SC-55mkII is selected, the Alternate Voicings is forcibly applied to replace with the original SC-55 capital tone. It is not recommend because the newly added tones in the SC-55mkII will become unavailable.

### SC-55 (Recommended)

The newly added tones in the SC-55mkII are selected as-is, and for non-existent tones, the same Alternate Voicings as the original SC-55 is applied. Considering both compatibility with the original SC-55 and the convenience as the SC-55mkII, it is the most convenient and recommended.

### SC-55mkII

This mode simulates that "if the SC-55mkII had implemented Alternate Voicings, it would have worked like this." 

To give a specific example, when "Program No. 17 / Bank No. 18" is specified, the original SC-55 falls back to the capital tone ("Organ 1") because no tone is assigned to Bank No. 16 as sub-capital. However, in this mode, it falls back to "60's Organ 1" in Bank No. 16 (newly added in the SC-55mkII).

Alternate Voicings were removed from the SC-55mkII, but subsequent Sound Canvas models had been continued to add new tones following the principle of assigning representative sub-capital tones to bank numbers that are multiples of 8. For the variation tones of "Organ 1" from Program No. 17 mentioned earlier, the SC-55mkII added "60's Organ 1" to Bank No. 16, and the SC-88 further added "60's Organ 2" and "60's Organ 3" to Bank No. 17 and 18.

Using this mode might allow to fall back to more appropriate tones when playing SC-88 (or later) song data on the SC-55mkII, by substituting tones that exist only on the SC-88 with tones available on the SC-55mkII.

However, the SC-88 introduced the concept of "Map". While maintaining upward compatibility by providing maps (such as the "SC-55 Map") that preserved the entire tones of previous Sound Canvas, downward compatibility was completely lost because the new maps contained new tones with entirely different characteristics, even if they have the same program or bank numbers. Therefore, the improvement in backward compatibility achieved by this mode will likely be minimal.


Compatibility options (Drum)
----------------------------

### SC-55 v1.21 or earlier (Recommended)

Apply Alternate Voicings to the range of drum set Program No. 1 to 64. Same as SC-55 v1.21 or earlier.

A very small number of PC games mistakenly select the ORCHESTRA Set (Program No. 49) with No. 50 or 51, so considering this, this mode is recommended.

### SC-55 v2.00

Apply Alternate Voicings to the range of drum set only Program No. 1 to 48. Same as SC-55 v2.00.

The reason why Alternate Voicings on v2.00 is no longer applied to drum set Program No. 49 through 64 has not been documented. This is just my guess, but at some point, policies may have been established that "Alternate Voicings should not be applied to drum sets incompatible with General MIDI (such as ORCHESTRA Set or SFX Set)" and "drum sets incompatible with General MIDI should be assigned to Program No. 49 or later." In fact, all of GM-incompatible drum sets added in models after the SC-88, such as the ETHNIC Set and KICK & SNARE Set, are assigned to Program No. 49 or later.


License
-------

MIT


Author
------

[shingo45endo](https://github.com/shingo45endo)
