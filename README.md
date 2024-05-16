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

As for drum sets, the firmware ROM also has a table of 1 byte x 128 programs in the range of 0x030000-0x038000. Similar to the tone tables, if there is no drum set corresponding to the program number, 0xff is stored. This tool rewrites the table according to the behavior of firmware v1.21.


License
-------

MIT


Author
------

[shingo45endo](https://github.com/shingo45endo)
