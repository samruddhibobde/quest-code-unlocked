import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Lock } from "lucide-react";

const Avatar = () => {
  const [equipped, setEquipped] = useState({
    helmet: 'basic',
    armor: 'starter',
    weapon: 'keyboard',
  });

  const cosmetics = {
    helmets: [
      { id: 'basic', name: 'Basic Cap', unlocked: true, coins: 0 },
      { id: 'pro', name: 'Pro Headset', unlocked: true, coins: 0 },
      { id: 'master', name: 'Master Crown', unlocked: false, coins: 500 },
    ],
    armors: [
      { id: 'starter', name: 'Starter Hoodie', unlocked: true, coins: 0 },
      { id: 'dev', name: 'Dev Suit', unlocked: false, coins: 300 },
    ],
    weapons: [
      { id: 'keyboard', name: 'Mechanical Keyboard', unlocked: true, coins: 0 },
      { id: 'staff', name: 'Code Staff', unlocked: false, coins: 400 },
    ],
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Avatar Creator</h1>
          <p className="text-muted-foreground">Customize your coding character</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Avatar Preview */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Your Avatar</CardTitle>
              <CardDescription>Preview your customizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg bg-gradient-cosmic flex items-center justify-center mb-4">
                <User className="w-48 h-48 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 rounded bg-muted">
                  <span className="text-sm">Helmet:</span>
                  <Badge>{cosmetics.helmets.find(h => h.id === equipped.helmet)?.name}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-muted">
                  <span className="text-sm">Armor:</span>
                  <Badge>{cosmetics.armors.find(a => a.id === equipped.armor)?.name}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-muted">
                  <span className="text-sm">Weapon:</span>
                  <Badge>{cosmetics.weapons.find(w => w.id === equipped.weapon)?.name}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cosmetics Shop */}
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Helmets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cosmetics.helmets.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-lg border flex items-center justify-between ${
                      item.unlocked ? 'border-border' : 'border-muted opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {!item.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.unlocked ? (
                      <Button 
                        size="sm" 
                        variant={equipped.helmet === item.id ? "default" : "outline"}
                        onClick={() => setEquipped({ ...equipped, helmet: item.id })}
                      >
                        {equipped.helmet === item.id ? 'Equipped' : 'Equip'}
                      </Button>
                    ) : (
                      <Badge variant="outline">{item.coins} coins</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Armor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cosmetics.armors.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-lg border flex items-center justify-between ${
                      item.unlocked ? 'border-border' : 'border-muted opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {!item.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.unlocked ? (
                      <Button 
                        size="sm" 
                        variant={equipped.armor === item.id ? "default" : "outline"}
                        onClick={() => setEquipped({ ...equipped, armor: item.id })}
                      >
                        {equipped.armor === item.id ? 'Equipped' : 'Equip'}
                      </Button>
                    ) : (
                      <Badge variant="outline">{item.coins} coins</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Avatar;
