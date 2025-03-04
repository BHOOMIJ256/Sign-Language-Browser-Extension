Sign_language_mapping  =  {

    ("everyone", "everybody", "all"): "Videos/everyone.mp4",
    ("going", "go", "move", "proceed", "depart"): "Videos/going.mp4",
    ("I", "me", "myself"): "Videos/I.mp4",
    ("interest", "curiosity", "concern", "attention"): "Videos/interest.mp4",
    ("question", "query", "inquiry", "ask"): "Videos/question.mp4",
    ("say", "speak", "tell", "express", "mention"): "Videos/say.mp4",
    ("tough", "hard", "difficult", "challenging"): "Videos/tough.mp4",
    ("pick", "choose", "select", "opt"): "Videos/pick.mp4",
    ("different", "varied", "distinct", "unique", "diverse"): "Videos/different.mp4",
    ("way", "path", "route", "method", "approach"): "Videos/path.mp4",
    ("nothing", "zero", "none", "void", "empty"): "Videos/nothing.mp4",
    ("easy", "simple", "effortless", "straightforward"): "Videos/easy.mp4",
    ("free", "liberated", "unrestricted", "independent"): "Videos/free.mp4",
    ("want", "desire", "wish", "need", "crave"): "Videos/want.mp4",
    ("successful", "victorious", "accomplished", "prosperous"): "Videos/success.mp4",
    ("think", "ponder", "consider", "reflect", "analyze"): "Videos/think.mp4",
    ("pay", "compensate", "settle", "remunerate"): "Videos/pay.mp4",
    ("price", "cost", "value", "expense"): "Videos/price.mp4",
    ("ill", "sick", "unwell", "ailing"): "Videos/ill.mp4",
    ("live", "exist", "survive", "reside"): "Videos/live.mp4",
    ("18", "eighteen") : "Videos/18.mp4",
    ("year", "annual", "12 months"): "Videos/year.mp4",
    ("today", "present", "now", "current day"): "Videos/today.mp4",
    ("size", "dimension", "scale", "magnitude"): "Videos/size.mp4",
    ("lucky", "fortunate", "blessed"): "Videos/lucky.mp4",
    ("work", "job", "labor", "task", "duty"): "Videos/work.mp4",
    ("much", "a lot", "plenty", "many"): "Videos/much.mp4",
    ("people", "humans", "individuals", "crowd"): "Videos/people.mp4",
    ("never", "not ever", "at no time"): "Videos/never.mp4",
    ("sleep", "rest", "nap", "slumber"): "Videos/sleep.mp4",
    ("well", "fine", "good", "healthy"): "Videos/well.mp4",
    ("sound", "noise", "audio", "tone"): "Videos/sound.mp4",
    ("evening", "nightfall", "dusk", "sunset"): "Videos/evening.mp4",
    ("travel", "journey", "trip", "voyage"): "Videos/travel.mp4",
    ("last", "final", "ultimate", "previous"): "Videos/last.mp4",
    ("hour", "time", "60 minutes"): "Videos/hour.mp4",
    ("flat", "level", "smooth", "even"): "Videos/flat.mp4",
    ("working", "employed", "engaged", "occupied"): "Videos/work.mp4",
    ("team", "group", "squad", "crew"): "Videos/team.mp4",
    ("like", "similar to", "appreciate", "enjoy"): "Videos/like.mp4",
    ("normal", "usual", "standard", "typical"): "Videos/normal.mp4",
    ("company", "business", "firm", "organization"): "Videos/company.mp4",
    ("day", "morning", "afternoon", "sunrise"): "Videos/day.mp4",
    ("night", "dark", "midnight", "evening"): "Videos/night.mp4",
    ("arrive","come","reach","appear","land"): "Vidoes/come.mp4",
    ("leave","go away","depart","leave behind","retire"): "Videos/leave.mp4",
    ("open","unlock","unlock door","unlock gate","enter"): "Videos/open.mp4",
    ("close","lock","lock door","lock gate","exit"): "Videos/close.mp4",
    ("begin","start", "commence", "initiate", "launch"): "Videos/begin.mp4",
    ("break","shatter", "crack", "split", "fracture"): "Videos/break.mp4",
    ("build","construct", "assemble", "create", "develop"):"Videos/build.mp4",
    ("buy","purchase", "acquire", "obtain", "get"):"Videos/buy.mp4",
    ("call","phone", "ring", "contact", "dial"):"Videos/call.mp4",
    ("explain","describe", "clarify", "illustrate", "define"):"Videos/explain",
    ("help","assist", "aid", "support", "guide"):"Videos/help.mp4",
    ("hope","wish", "desire", "aspire", "dream"):"Videos/wish.mp4",
    ("change","modify", "adjust", "alter", "transform"):"Vieos/change.mp4",
    ("learn","study", "understand", "grasp", "master"):"Videos/learn.mp4",
    ("listen","hear", "attend", "pay attention", "tune in"):"Videos/listen.mp4",
    ("look","see", "watch", "observe", "glance"):"Videos/look.mp4",
    ("meet","gather", "join", "encounter", "assemble"):"Videos/meet.mp4",
    ("advice","guidance", "suggestion", "recommendation", "tip"):"Videos/suggest.mp4",
    ("anger","rage", "fury", "wrath", "resentment"):"Videos/anger.mp4",
    ("answer","reply", "response", "solution", "resolution"):"Videos/answer.mp4",
    ("book","novel", "story", "publication", "manuscript"):"Videos/book.mp4",
    ("chance","opportunity", "possibility", "risk", "luck"):"Videos/chance.mp4",
    ("danger","risk", "threat", "hazard", "peril"):"Videos/danger.mp4",
    ("example","illustration", "sample", "demonstration", "instance"):"Videos/example.mp4",
    ("beautiful","pretty", "gorgeous", "lovely", "attractive"):"Videos/beautiful.mp4",
    ("boring","dull", "uninteresting", "tiresome", "monotonous"):"Videos/dull.mp4",
    ("brave","courageous", "fearless", "bold", "valiant"):"Videos/brave.mp4",
    ("clean","tidy", "neat", "spotless", "sanitary"):"Videos/clean.mp4",
    ("clever","smart", "intelligent", "brilliant", "sharp"):"Videos/clever.mp4",


}


def get_video_path(word):
    """Finds the corresponding sign language video path for a given word."""
    
    # Iterate through the dictionary keys (which are tuples)
    for key in Sign_language_mapping:
        if isinstance(key, tuple) and word in key:  # Check if the word is in the tuple
            return Sign_language_mapping[key]
        elif key == word:  # Direct match (for single-word keys)
            return Sign_language_mapping[key]
    
    return "Video not found"
