# OneDrive anchor IDs — client's drive, shared to sharry00010@gmail.com (scope: users, can edit)
Not secrets, just folder identifiers. ALWAYS use the API-call module with these IDs.
NEVER the folder picker (it only shows the connection's own drive — see D-19/D-21).

**driveId:** `A0BABA3C2640082C` (owner robin_multani007@hotmail.com / "YALE MIGRATION")
**Read pattern:** `GET /v1.0/drives/A0BABA3C2640082C/items/<itemId>/children?$select=name,id&$top=999`
**Create pattern:** `POST /v1.0/drives/A0BABA3C2640082C/items/<parentId>/children`
  body: `{"name":"<folder>","folder":{},"@microsoft.graph.conflictBehavior":"fail"}`

| Folder (level 1 = ONE SYSTEM children) | itemId | Size/notes |
|---|---|---|
| **YALE MIGRATION - ONE SYSTEM** (root) | `A0BABA3C2640082C!sb56138531b714289a454795636c629f5` | share anchor, 5 children |
| BRISBANE OFFICE | `A0BABA3C2640082C!s108fdc0b98c54dafbec0ba09377b5a35` | 68.2 GB — main office |
| INFORMATION HUB | `A0BABA3C2640082C!sabeb092f5aa947ce96e89bfef41e2459` | new 28-Jul; client: "info about skills assessment & visa applications" → KEEP (reference library, not client files) |
| PHILIPPINES | `A0BABA3C2640082C!scad8a318943846ca8a81513279e9ea6e` | 25 MB |
| TOWNSVILLE | `A0BABA3C2640082C!s35a05b1d476a452ea47170ba470e6034` | 46 MB |
| Work visa BNE AND TSV | `A0BABA3C2640082C!s125354abdab141af87f47d49394feec3` | 82 MB |
| BNE → APPLICATION FORMS | `A0BABA3C2640082C!sc9b3012895a745e0a295c9967ba32c1f` | 199 MB (templates, not clients) |
| BNE → CLIENT FILES | TBC | next read |
| BNE → CLIENT FILES → ENGAGED CLIENTS → team → client | TBC | need real sub-folder structure |
