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
| BNE → CLIENT FILES | `A0BABA3C2640082C!s3b01f26d7900497a81693f9f7bff7681` | ✅ T1.1 — path to clients |
| BNE → INQUIRY | `A0BABA3C2640082C!se4c3fed3c2f64a0c94ba085145d4903e` | ✅ T1.1 — 🔍 check for walk-in/enquiry records |
| BNE → PARTNER SCHOOL | `A0BABA3C2640082C!sa3369935a9da43559d44a751a0ec2435` | ✅ T1.1 — education partners (M4 later) |
| BNE → Service Agreement 189 and 190 | `A0BABA3C2640082C!sfd29f35375c4437684f89c19823e4461` | ✅ T1.1 — item seen in sharedWithMe |
| CLIENT FILES → **ENGAGED CLIENTS** | `A0BABA3C2640082C!s29890e4b48cc4ea4bbf4e92eb73689a7` | ✅ T1.2 — active clients |
| CLIENT FILES → **GRANTED** | `A0BABA3C2640082C!s985f1ffb73a34d45ac271d4354d18df5` | ✅ T1.2 — lifecycle: folders MOVED here on grant |
| CLIENT FILES → **REFUSED OR WITHDRAWN** | `A0BABA3C2640082C!s456e3bcd584843898ebfb052d68a9057` | ✅ T1.2 — lifecycle |
| CLIENT FILES → **Engaged Client Tracker.xlsx** | `A0BABA3C2640082C!s991d8bd1da0b40b0a4e477e47864ebbc` | ✅ T1.2 — 🚨 live register, 208 revisions — read via workbook API |
| … → team folders (Filipino / Indian) | TBC (T1.3) | router targets |
| … → one real client folder | TBC (T1.4) | verify ACTUAL sub-folder names |
